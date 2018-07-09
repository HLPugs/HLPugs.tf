import * as React from 'react';
import { Link } from 'react-router-dom';
import { ChatMessageType } from '../../../../common/types';
import './style.css';

interface ChatMessageProps {
    properties: ChatMessageType;
}
class ChatMessage extends React.Component<ChatMessageProps, {}> {
    render() {
        return (
            <div className="message">
                <div className="info">
                    <Link to={`/profile/${this.props.properties.userid}`} className="username">
                        {this.props.properties.username}
                    </Link>
                    <div className="timestamp">
                        {this.props.properties.timestamp.getHours()}:{this.props.properties.timestamp.getMinutes()}
                    </div>
                </div>
                <div>
                    {this.props.properties.message}
                </div>
            </div>
        );
    }
}

export default ChatMessage;
