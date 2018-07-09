import * as React from 'react';
import './style.css';

interface ChatInputProps {
    socket: SocketIOClient.Socket;
}
class ChatInput extends React.Component<ChatInputProps, {}> {
    render() {
        return (
            <div id="inputHolder">
                <textarea placeholder="@Support for serious concerns" id="messageInput" />
            </div>
        );
    }
}

export default ChatInput;