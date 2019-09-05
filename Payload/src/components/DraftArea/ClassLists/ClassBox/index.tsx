import React from 'react';
import ClassIcon from '../../../ClassIcon';
import './style.scss';
import PlayerBox from './PlayerBox';
import DraftTFClass from '../../../../../../Common/Enums/DraftTFClass';
import AddToDraftTFClassDTO from '../../../../../../Common/DTOs/AddToDraftClassListDTO';
import GamemodeClassScheme from '../../../../../../Common/Models/GamemodeClassScheme';
import GetDraftTFClassListDTO from '../../../../../../Common/DTOs/GetDraftTFClassListDTO';
import RemovePlayerFromDraftTFClassDTO from '../../../../../../Common/DTOs/RemovePlayerFromDraftTFClassDTO';

interface ClassBoxProps {
	properties: GamemodeClassScheme;
	socket: SocketIOClient.Socket;
	steamid?: string;
}

interface ClassBoxState {
	players: string[];
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

		this.props.socket.on(
			'draftTFClassList',
			(tfClass: DraftTFClass, tfClassList: string[]) => {
				if (tfClass === this.props.properties.tf2class) {
					this.setState({
						players: tfClassList
					});
				}
			}
		);

		this.props.socket.on(
			'addPlayerToDraftTFClass',
			(tfClass: DraftTFClass, steamid: string) => {
				if (tfClass === this.props.properties.tf2class) {
					this.setState({
						players: [...this.state.players, steamid]
					});
				}
			}
		);

		this.props.socket.on(
			'removePlayerFromDraftTFClass',
			(tfClass: DraftTFClass, steamid: string) => {
				if (tfClass === this.props.properties.tf2class) {
					const newPlayers = [...this.state.players];
					const indexOfPlayer = newPlayers.indexOf(steamid);

					if (indexOfPlayer >= 0) {
						newPlayers.splice(indexOfPlayer, 1);

						this.setState({
							players: newPlayers
						});
					}
				}
			}
		);

		this.state = {
			players: []
		};
	}

	toggleClass = () => {
		if (!this.props.steamid) {
			return;
		}

		if (this.state.players.indexOf(this.props.steamid) >= 0) {
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
					this.state.players.indexOf(this.props.steamid) >= 0
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
						<span className="added">{this.state.players.length}</span>
						<span>/</span>
						<span className="needed">
							{this.props.properties.numberPerTeam * 2}
						</span>
					</span>
					{this.checkbox()}
				</div>
				<div className="playerList">
					{this.state.players.map(player => (
						<PlayerBox steamid={player} key={player} />
					))}
				</div>
			</div>
		);
	}
}

export default ClassBox;
