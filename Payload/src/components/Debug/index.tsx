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
		command: 'login',
		options: {}
	},
	{
		title: 'Log out',
		command: 'logout',
		options: {}
	},
	{
		title: 'Add Fake Player',
		command: 'fake-player',
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

	runCommand = (command: string, options: any) => {
		this.props.socket.emit('debug', { command, options });
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
								onClick={() => this.runCommand(action.command, action.options)}
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
