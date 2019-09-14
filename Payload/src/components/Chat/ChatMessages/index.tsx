import React from 'react';
import Message from '../../../../../Common/Models/Message';
import ChatMessage from './ChatMessage';
import { CustomEmoji } from 'emoji-mart';
import './style.scss';
import { FontAwesomeIcon } from '../../../../node_modules/@fortawesome/react-fontawesome';

interface ChatMessagesProps {
	socket: SocketIOClient.Socket;
	customEmojis: CustomEmoji[];
	steamid?: string;
	alias?: string;
}

interface ChatMessagesState {
	messages: Message[];
	showNewMessage: boolean;
}

class ChatMessages extends React.Component<ChatMessagesProps, ChatMessagesState> {
	private messageList: React.RefObject<HTMLDivElement>;

	constructor(props: ChatMessagesProps) {
		super(props);

		this.messageList = React.createRef();

		this.props.socket.emit('getMessageHistory');

		this.props.socket.on('getMessageHistory', (messageHistory: Message[]) => {
			this.setState({
				messages: messageHistory
			});

			this.scrollToBottom();
		});

		this.props.socket.on('sendMessage', (message: Message) => {
			if (this.messageList.current) {
				const scrollPosition = this.messageList.current.scrollTop;
				const scrollHeight = this.messageList.current.scrollHeight - this.messageList.current.clientHeight;

				this.setState({
					messages: [...this.state.messages, message]
				});

				if (this.props.steamid === message.authorSteamid) {
					this.scrollToBottom();
				}

				const newScrollHeight = this.messageList.current.scrollHeight - this.messageList.current.clientHeight;

				if (scrollHeight - scrollPosition > 25) {
					this.setState({
						showNewMessage: true
					});
				} else {
					this.messageList.current.scrollTop = newScrollHeight;
				}
			}
		});

		this.state = {
			messages: [],
			showNewMessage: false
		};
	}

	handleScroll = () => {
		if (this.messageList.current) {
			const scrollPosition = this.messageList.current.scrollTop;
			const scrollHeight = this.messageList.current.scrollHeight - this.messageList.current.clientHeight;

			if (scrollHeight - scrollPosition < 25) {
				this.setState({
					showNewMessage: false
				});
			}
		}
	};

	scrollToBottom = () => {
		if (!this.messageList.current) {
			return;
		}

		const scrollHeight = this.messageList.current.scrollHeight - this.messageList.current.clientHeight;
		this.messageList.current.scrollTop = scrollHeight;
	};

	newMessageIndicator = () => {
		if (!this.state.showNewMessage) {
			return null;
		}
		return (
			<div id="newMessage" onClick={this.scrollToBottom}>
				<FontAwesomeIcon icon="arrow-down" />
				New Message!
			</div>
		);
	};

	render() {
		return (
			<>
				<div id="messageList" ref={this.messageList} onScroll={this.handleScroll}>
					{this.state.messages.map((message: Message) => (
						<ChatMessage
							{...message}
							key={message.id}
							alias={this.props.alias}
							customEmojis={this.props.customEmojis}
						/>
					))}
				</div>
				{this.newMessageIndicator()}
			</>
		);
	}
}

export default ChatMessages;
