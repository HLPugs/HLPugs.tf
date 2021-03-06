import React from 'react';
import ClassIcon from '../../../ClassIcon';
import './style.scss';
import PlayerBox from './PlayerBox';
import DraftTFClass from '../../../../../../Common/Enums/DraftTFClass';
import AddPlayerToDraftTFClassRequest from '../../../../../../Common/Requests/AddToDraftTFClassRequest';
import GamemodeClassScheme from '../../../../../../Common/Models/GamemodeClassScheme';
import GetDraftTFClassListRequest from '../../../../../../Common/Requests/GetDraftTFClassListRequest';
import RemovePlayerFromDraftTFClassRequest from '../../../../../../Common/Requests/RemovePlayerFromDraftTFClassRequest';
import SteamID from '../../../../../../Common/Types/SteamID';
import AddPlayerToDraftTFClassResponse from '../../../../../../Common/Responses/AddPlayerToDraftTFClassResponse';
import RemovePlayerFromDraftTFClassResponse from '../../../../../../Common/Responses/RemovePlayerFromDraftTFClassResponse';

interface ClassBoxProps {
	properties: GamemodeClassScheme;
	socket: SocketIOClient.Socket;
	steamid?: SteamID;
}

interface ClassBoxState {
	playersAddedToClass: SteamID[];
}

class ClassBox extends React.Component<ClassBoxProps, ClassBoxState> {
	constructor(props: ClassBoxProps) {
		super(props);

		const request: GetDraftTFClassListRequest = {
			draftTFClass: this.props.properties.tf2class
		};
		this.props.socket.emit('getDraftTFClassList', request);

		this.props.socket.on('reconnect', () => {
			const request: GetDraftTFClassListRequest = {
				draftTFClass: this.props.properties.tf2class
			};
			this.props.socket.emit('getDraftTFClassList', request);
		});

		this.props.socket.on('draftTFClassList', (tfClass: DraftTFClass, playersAddedToClass: SteamID[]) => {
			if (tfClass === this.props.properties.tf2class) {
				this.setState({ playersAddedToClass });
			}
		});

		this.props.socket.on('addPlayerToDraftTFClass', (response: AddPlayerToDraftTFClassResponse) => {
			if (response.draftTFClass === this.props.properties.tf2class) {
				this.setState({
					playersAddedToClass: [...this.state.playersAddedToClass, response.steamid]
				});
			}
		});

		this.props.socket.on('removePlayerFromDraftTFClass', (response: RemovePlayerFromDraftTFClassResponse) => {
			if (response.draftTFClass === this.props.properties.tf2class) {
				const newPlayers = [...this.state.playersAddedToClass];
				const indexOfPlayer = newPlayers.indexOf(response.steamid);

				if (indexOfPlayer >= 0) {
					newPlayers.splice(indexOfPlayer, 1);

					this.setState({
						playersAddedToClass: newPlayers
					});
				}
			}
		});

		this.state = {
			playersAddedToClass: []
		};
	}

	toggleClass = () => {
		if (!this.props.steamid) {
			return;
		}

		if (this.state.playersAddedToClass.includes(this.props.steamid)) {
			const request: RemovePlayerFromDraftTFClassRequest = {
				draftTFClass: this.props.properties.tf2class
			};

			this.props.socket.emit('removePlayerFromDraftTFClass', request);
		} else {
			const request: AddPlayerToDraftTFClassRequest = {
				draftTFClass: this.props.properties.tf2class
			};

			this.props.socket.emit('addPlayerToDraftTFClass', request);
		}
	};

	checkbox = () => {
		if (!this.props.steamid) {
			return <div />;
		}

		return (
			<div
				className={
					this.state.playersAddedToClass.includes(this.props.steamid) ? 'classCheckbox checked' : 'classCheckbox'
				}
				onClick={this.toggleClass}
			/>
		);
	};

	render() {
		return (
			<div className="tfclass">
				<div className="classHeader">
					<span className="classIcon">
						<ClassIcon name={this.props.properties.tf2class} />
					</span>
					<span />
					<span className="className">{this.props.properties.tf2class}</span>
					<span className="count">
						<span className="added">{this.state.playersAddedToClass.length}</span>
						<span>/</span>
						<span className="needed">{this.props.properties.numberPerTeam * 2}</span>
					</span>
					{this.checkbox()}
				</div>
				<div className="playerList">
					{this.state.playersAddedToClass.map(steamid => (
						<PlayerBox steamid={steamid} />
					))}
				</div>
			</div>
		);
	}
}

export default ClassBox;
