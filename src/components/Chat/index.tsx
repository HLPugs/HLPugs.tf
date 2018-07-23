import * as React from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { CustomEmoji } from 'emoji-mart';
import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserScheme } from '../../common/types';

interface ChatProps {
    socket: SocketIOClient.Socket;
    user: UserScheme;
}

interface ChatState {
    active: boolean;
    customEmojis: CustomEmoji[];
}

class Chat extends React.Component<ChatProps, ChatState> {
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
    }

    render() {
        return (
            <aside className={this.state.active ? 'chatActive' : ''}>
                <div id="chatOpener" onClick={this.toggleChat}>
                    <FontAwesomeIcon icon="comments" />
                </div>
                <ChatMessages 
                    socket={this.props.socket}
                    customEmojis={this.state.customEmojis}
                    steamid={this.props.user.steamid}
                />
                <ChatInput 
                    socket={this.props.socket} 
                    loggedIn={this.props.user.loggedIn} 
                    customEmojis={this.state.customEmojis}
                />
            </aside>
        );
    }
}

export default Chat;