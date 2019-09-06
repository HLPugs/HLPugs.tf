import React from 'react';
import ClassIcon from '../../../ClassIcon';
import './style.scss';
import PlayerBox from './PlayerBox';
import DraftTFClass from '../../../../../../Common/Enums/DraftTFClass';
import AddToDraftTFClassDTO from '../../../../../../Common/DTOs/AddToDraftClassListDTO';
import GamemodeClassScheme from '../../../../../../Common/Models/GamemodeClassScheme';
import GetDraftTFClassListDTO from '../../../../../../Common/DTOs/GetDraftTFClassListDTO';
import RemovePlayerFromDraftTFClassDTO from '../../../../../../Common/DTOs/RemovePlayerFromDraftTFClassDTO';
import SteamID from '../../../../../../Common/Types/SteamID';

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

		const getDraftTFClassListDTO: GetDraftTFClassListDTO = {
			draftTFClass: this.props.properties.tf2class
		};
		this.props.socket.emit('getDraftTFClassList', getDraftTFClassListDTO);

		this.props.socket.on('reconnect', () => {
			const getDraftTFClassListDTO: GetDraftTFClassListDTO = {
				draftTFClass: this.props.properties.tf2class
			};
			this.props.socket.emit('getDraftTFClassList', getDraftTFClassListDTO);
		});

		this.props.socket.on('draftTFClassList', (tfClass: DraftTFClass, playersAddedToClass: SteamID[]) => {
			if (tfClass === this.props.properties.tf2class) {
				this.setState({ playersAddedToClass });
			}
		});

		this.props.socket.on('addPlayerToDraftTFClass', (tfClass: DraftTFClass, steamid: SteamID) => {
			if (tfClass === this.props.properties.tf2class) {
				this.setState({
					playersAddedToClass: [...this.state.playersAddedToClass, steamid]
				});
			}
		});

		this.props.socket.on('removePlayerFromDraftTFClass', (tfClass: DraftTFClass, steamid: SteamID) => {
			if (tfClass === this.props.properties.tf2class) {
				const newPlayers = [...this.state.playersAddedToClass];
				const indexOfPlayer = newPlayers.indexOf(steamid);

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
			const removePlayerFromDraftTFClassDTO: RemovePlayerFromDraftTFClassDTO = {
				draftTFClass: this.props.properties.tf2class
			};

			this.props.socket.emit('removePlayerFromDraftTFClass', removePlayerFromDraftTFClassDTO);
		} else {
			const addToDraftTFClassDTO: AddToDraftTFClassDTO = {
				draftTFClass: this.props.properties.tf2class
			};

			this.props.socket.emit('addPlayerToDraftTFClass', addToDraftTFClassDTO);
		}
	};

	checkbox = () => {
		if (!this.props.steamid) {
			return <div />;
		}

		return (
			<div
				className={
					this.state.playersAddedToClass.includes(this.props.steamid)
						? 'classCheckbox checked'
						: 'classCheckbox'
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
