import * as React from 'react';
import { ChatMessageType } from '../../../common/types';
import ChatMessage from './ChatMessage';
import './style.css';
import { FontAwesomeIcon } from '../../../../node_modules/@fortawesome/react-fontawesome';

interface ChatMessagesProps {
    socket: SocketIOClient.Socket;
}

interface ChatMessagesState {
    messages: ChatMessageType[];
    showNewMessage: boolean;
}

class ChatMessages extends React.Component<ChatMessagesProps, ChatMessagesState> {

    private messageList: React.RefObject<HTMLDivElement>;

    constructor(props: ChatMessagesProps) {
        super(props);

        this.messageList = React.createRef();

        this.props.socket.on('newMessage', (messageObject: ChatMessageType) => {
            if (this.messageList.current) {
                const scrollPosition = this.messageList.current.scrollTop;
                const scrollHeight = this.messageList.current.scrollHeight - this.messageList.current.clientHeight;

                this.setState({
                    messages: this.state.messages.concat([messageObject])
                });

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
            messages: [
                {
                    username: 'Nicell',
                    userid: '7',
                    id: '20902692',
                    timestamp: new Date().getTime(),
                    message: 'Pugs? :thinking_face: :thinking_face:'
                },
                {
                    username: 'exaflamer1',
                    userid: '8',
                    id: '1509238509',
                    timestamp: new Date().getTime(),
                    message: 'pugs r dead :frowning:'
                },
                {
                    username: 'Nicell',
                    userid: '7',
                    id: '18510815',
                    timestamp: new Date().getTime(),
                    message: 'rip :cry:'
                }
            ],
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
    }

    scrollToBottom = () => {
        if (this.messageList.current) {
            const scrollHeight = this.messageList.current.scrollHeight - this.messageList.current.clientHeight;
            this.messageList.current.scrollTop = scrollHeight;
        }
    }

    newMessageIndicator = () => {
        if (this.state.showNewMessage) {
            return (
                <div id="newMessage" onClick={this.scrollToBottom}>
                    <FontAwesomeIcon icon="arrow-down" />
                    New Message!
                </div>
            );
        }

        return null;
    }

    render() {
        return (
            <>
                <div id="messageList" ref={this.messageList} onScroll={this.handleScroll}>
                    {this.state.messages.map((message: ChatMessageType) => 
                        <ChatMessage {... message} key={message.id} />
                    )}
                </div>
                {this.newMessageIndicator()}
            </>
        );
    }
}

export default ChatMessages;