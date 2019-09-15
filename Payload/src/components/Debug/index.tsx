import React from 'react';
import './style.scss';
import { LoggedInPlayersConsumer } from '../../pages/Home';
import PlayerViewModel from '../../../../Common/ViewModels/PlayerViewModel';
import GamemodeClassScheme from '../../../../Common/Models/GamemodeClassScheme';

interface DebugProps {
	socket: SocketIOClient.Socket;
	classes: GamemodeClassScheme[];
}

interface DebugState {
	open: boolean;
	targetPlayer: string;
	targetClass: string;
}

const buttons = [
	{
		title: 'Login',
		emit: 'fakeLogin',
		options: {}
	},
	{
		title: 'Log out',
		emit: 'fakeLogout',
		options: {
			steamid: '76561198119135809'
		}
	},
	{
		title: 'Add Fake Player',
		emit: 'addFakePlayer',
		options: {
			name: 'Nicell'
		}
	}
];

class Debug extends React.Component<DebugProps, DebugState> {
	constructor(props: DebugProps) {
		super(props);

		this.state = {
			open: false,
			targetPlayer: '',
			targetClass: ''
		};
	}

	toggleDebug = () => {
		this.setState({ open: !this.state.open });
	};

	updateTargetPlayer = (e: React.ChangeEvent<HTMLSelectElement>) => {
		this.setState({
			targetPlayer: e.target.value
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
								<select onChange={this.updateTargetPlayer} value={this.state.targetPlayer}>
									{playerData.map(p => (
										<option value={p.steamid}>{p.alias}</option>
									))}
								</select>
								<span>Target Class: </span>
								<select onChange={this.updateTargetClass} value={this.state.targetClass}>
									{this.props.classes.map(c => (
										<option value={c.tf2class}>{c.tf2class}</option>
									))}
								</select>
							</div>
							<div className="DebugButtons">
								{buttons.map(action => (
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
