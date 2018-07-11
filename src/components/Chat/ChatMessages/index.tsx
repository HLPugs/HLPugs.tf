import * as React from 'react';
import { ChatMessageType } from '../../../common/types';
import ChatMessage from './ChatMessage';
import './style.css';

interface ChatMessagesProps {
    socket: SocketIOClient.Socket;
}

interface ChatMessagesState {
    messages: ChatMessageType[];
}

class ChatMessages extends React.Component<ChatMessagesProps, ChatMessagesState> {
    constructor(props: ChatMessagesProps) {
        super(props);

        this.state = {
            messages: [
                {
                    username: 'Nicell',
                    userid: '7',
                    id: '20902692',
                    timestamp: new Date(),
                    message: 'Pugs? :thinking_face: :thinking_face:'
                },
                {
                    username: 'exaflamer1',
                    userid: '8',
                    id: '1509238509',
                    timestamp: new Date(),
                    message: 'pugs r dead :frowning:'
                },
                {
                    username: 'Nicell',
                    userid: '7',
                    id: '18510815',
                    timestamp: new Date(),
                    message: 'rip :cry:'
                }
            ]
        };
    }

    render() {
        return (
            <div id="messageList">
                {this.state.messages.map((message: ChatMessageType) => 
                    <ChatMessage properties={message} key={message.id} />
                )}
            </div>
        );
    }
}

export default ChatMessages;