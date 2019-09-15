import React from 'react';
import './style.scss';

interface DebugProps {
	socket: SocketIOClient.Socket;
}

interface DebugState {
	open: boolean;
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
			open: false
		};
	}

	toggleDebug = () => {
		this.setState({ open: !this.state.open });
	};

	render() {
		return process.env.NODE_ENV === 'development' ? (
			<div id="Debug">
				<button onClick={this.toggleDebug}>Debug</button>
				<div className="DebugWindow" style={{ display: this.state.open ? 'flex' : 'none' }}>
					<div className="DebugTitle">
						<span>Debug</span>
						<a onClick={this.toggleDebug}>Close</a>
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
		) : null;
	}
}

export default Debug;
