import * as React from 'react';
import { Link } from 'react-router-dom';
import { ChatMessageType } from '../../../../common/types';
import { Emoji } from 'emoji-mart';
import * as moment from 'moment';
import './style.css';

interface MessageElement {
    name?: string;
    offset?: number;
    length?: number;
    message?: string;
}

class ChatMessage extends React.Component<ChatMessageType, {}> {
    renderMessage = (message: string) => {
        let colonsRegex = new RegExp('(^|\\s)(\:[a-zA-Z0-9-_+]+\:(\:skin-tone-[2-6]\:)?)', 'g');

        let match;
        let emojis: MessageElement[] = [];
        while (match = colonsRegex.exec(message)) {
            let name = match[2];
            let offset: number = match.index + match[1].length;
            let length = name.length;

            emojis.push({
                name: name,
                offset: offset,
                length: length
            });
        }

        let lastPos = 0;
        let elements: MessageElement[] = [];

        if (!emojis.length) {
            return <span>{message}</span>;
        }

        for (const emoji of emojis) {
            if (lastPos !== emoji.offset) {
                elements.push({
                    message: message.substring(lastPos, emoji.offset)
                });
            }
            elements.push({
                name: emoji.name
            });

            if (emoji.offset !== undefined && emoji.length) {
                lastPos = emoji.offset + emoji.length;
            }
        }

        if (lastPos !== message.length) {
            elements.push({
                message: message.substring(lastPos, message.length)
            });
        }

        return elements.map((element: MessageElement, index: number) => {
            if (element.name) {
                return ( 
                    <Emoji emoji={element.name} size={20} set="twitter" sheetSize={32} tooltip={true} key={index} />
                );
            } else {
                return <span key={index}>{element.message}</span>;
            }
        });
    }

    render() {
        return (
            <div className="message">
                <div className="info">
                    <Link to={`/profile/${this.props.userid}`} target="blank" className="username">
                        {this.props.username}
                    </Link>
                    <div className="timestamp">
                        <span>{moment(this.props.timestamp).format('LT')}</span>
                    </div>
                </div>
                <div>
                    {this.renderMessage(this.props.message)}
                </div>
            </div>
        );
    }
}

export default ChatMessage;
