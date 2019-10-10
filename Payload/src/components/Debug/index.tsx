import React from 'react';
import './style.scss';
import { LoggedInPlayersConsumer } from '../../pages/Home';
import PlayerViewModel from '../../../../Common/ViewModels/PlayerViewModel';
import GamemodeClassScheme from '../../../../Common/Models/GamemodeClassScheme';
import SteamID from '../../../../Common/Types/SteamID';
import FakeAddPlayerToDraftTFClassRequest from '../../../../Common/Requests/FakeAddPlayerToDraftTFClassRequest';
import DraftTFClass from '../../../../Common/Enums/DraftTFClass';
import FakeRemovePlayerFromDraftTFClassRequest from '../../../../Common/Requests/FakeRemovePlayerFromDraftTFClassRequest';
import Role from '../../../../Common/Enums/Role';
import PermissionGroup from '../../../../Common/Enums/PermissionGroup';
import FAKE_OFFLINE_STEAMID from '../../../../Common/Constants/FakeOfflineSteamid';

interface DebugProps {
	socket: SocketIOClient.Socket;
	classes: GamemodeClassScheme[];
}

interface DebugState {
	open: boolean;
	targetPlayerSteamid: SteamID;
	targetClass: string;
}

class Debug extends React.Component<DebugProps, DebugState> {
	constructor(props: DebugProps) {
		super(props);

		this.state = {
			open: false,
			targetPlayerSteamid: '',
			targetClass: DraftTFClass.SCOUT
		};

		this.props.socket.on('addPlayerToSession', (playerViewModel: PlayerViewModel) => {
			this.setState({ targetPlayerSteamid: playerViewModel.steamid });
		});
	}

	buttons = () => {
		return [
			{
				title: 'Login',
				emit: 'fakeLogin',
				options: {}
			},
			{
				title: 'Log out',
				emit: 'fakeLogout',
				options: {
					steamid: FAKE_OFFLINE_STEAMID
				}
			},
			{
				title: 'Add Fake Player',
				emit: 'addFakePlayer',
				options: {
					name: 'Nicell'
				}
			},
			{
				title: 'Add to class',
				emit: 'fakeAddPlayerToDraftTFClass',
				options: {
					steamid: this.state.targetPlayerSteamid,
					draftTFClass: this.state.targetClass
				} as FakeAddPlayerToDraftTFClassRequest
			},
			{
				title: 'Remove from class',
				emit: 'fakeRemovePlayerFromDraftTFClass',
				options: {
					steamid: this.state.targetPlayerSteamid,
					draftTFClass: this.state.targetClass
				} as FakeRemovePlayerFromDraftTFClassRequest
			},
			{
				title: 'Add to all classes',
				emit: 'fakeAddPlayerToAllDraftTFClasses',
				options: {
					steamid: this.state.targetPlayerSteamid
				}
			},
			{
				title: 'Find Player',
				emit: 'findPlayerByAlias',
				options: {
					alias: 'f'
				}
			},
			{
				title: 'Update role',
				emit: 'updatePlayerRoles',
				options: {
					roles: [Role.CONTRIBUTOR, Role.DEVELOPER],
					permissionGroup: PermissionGroup.HEAD_ADMIN
				}
			},
			{
				title: 'Send message',
				emit: 'sendMessage',
				options: {
					messageContent: 'test message'
				}
			}
		];
	};

	toggleDebug = () => {
		this.setState({ open: !this.state.open });
	};

	updateTargetPlayer = (e: React.ChangeEvent<HTMLSelectElement>) => {
		this.setState({
			targetPlayerSteamid: e.target.value
		});
	};

	updateTargetClass = (e: React.ChangeEvent<HTMLSelectElement>) => {
		this.setState({
			targetClass: e.target.value
		});
	};

	render() {
		return process.env.NODE_ENV === 'development' ? (
			<LoggedInPlayersConsumer>
				{(playerData: PlayerViewModel[]) => (
					<div id="Debug">
						<button onClick={this.toggleDebug}>Debug</button>
						<div className="DebugWindow" style={{ display: this.state.open ? 'flex' : 'none' }}>
							<div className="DebugTitle">
								<span>Debug</span>
								<a onClick={this.toggleDebug}>Close</a>
							</div>
							<div>
								<span>Target Player: </span>
								<select onChange={this.updateTargetPlayer} value={this.state.targetPlayerSteamid}>
									{playerData.map(p => (
										<option key={p.steamid} value={p.steamid}>
											{p.alias}
										</option>
									))}
								</select>
								<span>Target Class: </span>
								<select onChange={this.updateTargetClass} value={this.state.targetClass}>
									{this.props.classes.map(c => (
										<option key={c.tf2class} value={c.tf2class}>
											{c.tf2class}
										</option>
									))}
								</select>
							</div>
							<div className="DebugButtons">
								{this.buttons().map(action => (
									<div
										key={action.title}
										onClick={() => this.props.socket.emit(action.emit, action.options)}
										className="DebugAction"
									>
										{action.title}
									</div>
								))}
							</div>
						</div>
					</div>
				)}
			</LoggedInPlayersConsumer>
		) : null;
	}
}

export default Debug;
