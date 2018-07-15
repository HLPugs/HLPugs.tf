import * as React from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ChatProps {
    socket: SocketIOClient.Socket;
    loggedIn?: boolean;
}

interface ChatState {
    active: boolean;
}

class Chat extends React.Component<ChatProps, ChatState> {
    constructor(props: ChatProps) {
        super(props);

        this.state = {
            active: false
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
                <ChatMessages socket={this.props.socket}/>
                <ChatInput socket={this.props.socket} loggedIn={this.props.loggedIn}/>
            </aside>
        );
    }
}

export default Chat;