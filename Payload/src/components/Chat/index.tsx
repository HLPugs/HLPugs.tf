import React from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { CustomEmoji } from 'emoji-mart';
import './style.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LoggedInPlayersConsumer } from '../../pages/Home';
import PlayerViewModel from '../../../../Common/ViewModels/PlayerViewModel';

interface ChatProps {
	socket: SocketIOClient.Socket;
	currentPlayer: PlayerViewModel;
}

interface ChatState {
	active: boolean;
	customEmojis: CustomEmoji[];
}

class Chat extends React.PureComponent<ChatProps, ChatState> {
	constructor(props: ChatProps) {
		super(props);

		this.props.socket.emit('requestCustomEmojis');

		this.props.socket.on('customEmojis', (customEmojis: CustomEmoji[]) => {
			this.setState({
				customEmojis: customEmojis
			});
		});

		this.state = {
			active: false,
			customEmojis: []
		};
	}

	toggleChat = () => {
		this.setState({
			active: !this.state.active
		});
	};

	render() {
		return (
			<LoggedInPlayersConsumer>
				{(playerData: PlayerViewModel[]) => (
					<aside className={this.state.active ? 'chatActive' : ''}>
						<div id="chatOpener" onClick={this.toggleChat}>
							<FontAwesomeIcon icon="comments" />
						</div>
						<ChatMessages
							socket={this.props.socket}
							customEmojis={this.state.customEmojis}
							steamid={this.props.currentPlayer.steamid}
							alias={this.props.currentPlayer.alias}
						/>
						<ChatInput
							socket={this.props.socket}
							isLoggedIn={this.props.currentPlayer.isLoggedIn}
							customEmojis={this.state.customEmojis}
							mentions={playerData ? playerData.map(p => p.alias) : []}
						/>
					</aside>
				)}
			</LoggedInPlayersConsumer>
		);
	}
}

export default Chat;
