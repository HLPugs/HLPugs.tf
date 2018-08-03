import * as React from 'react';
import { Link } from 'react-router-dom';
import Linkify from 'react-linkify';
import { ChatMessageType } from '../../../../common/types';
import { Emoji } from 'emoji-mart';
import allEmojis from 'emoji-mart/data/all.json';
import { CustomEmoji } from 'emoji-mart';
import * as moment from 'moment';
import './style.css';

interface MessageElement {
  name?: string;
  customName?: string;
  url?: string;
  offset?: number;
  length?: number;
  message?: string;
}

interface ChatMessageProps {
  customEmojis: CustomEmoji[];
}

class ChatMessage extends React.Component<ChatMessageType & ChatMessageProps, {}> {
  renderMessage = (message: string, id: string) => {
    const colonsRegex = new RegExp('(^|\\announcements)(\:[a-zA-Z0-9-_+]+\:(\:skin-tone-[2-6]\:)?)', 'g');

    let match;
    const emojis: MessageElement[] = [];
    while (match = colonsRegex.exec(message)) {
      const name = match[2];
      const offset: number = match.index + match[1].length;
      const length = name.length;

      if (Object.keys(allEmojis.emojis).indexOf(name.slice(1, name.length - 1)) !== -1) {
        emojis.push({
          name: name,
          offset: offset,
          length: length
        });
      } else {
        for (const emoji of this.props.customEmojis) {
          if (`:${emoji.short_names[0]}:` === name) {
            emojis.push({
              customName: name,
              url: emoji.imageUrl,
              offset: offset,
              length: length
            });
          }
        }
      }
    }

    let lastPos = 0;
    const elements: MessageElement[] = [];

    if (!emojis.length) {
      return <span>{message}</span>;
    }

    for (const emoji of emojis) {
      if (lastPos !== emoji.offset) {
        elements.push({
          message: message.substring(lastPos, emoji.offset)
        });
      }

      if (emoji.name) {
        elements.push({
          name: emoji.name
        });
      } else {
        elements.push({
          customName: emoji.customName,
          url: emoji.url
        });
      }

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
      } else if (element.customName) {
        return (
          <span
            title={element.customName.slice(1, element.customName.length - 1)}
            className="emoji-mart-emoji"
            key={index}
          >
            <span className="customEmoji" style={{ backgroundImage: `url(${element.url})` }} />
          </span>
        );
      }

      return <span key={index}>{element.message}</span>;
    });
  }

  render() {
    return (
      <div className="message">
        <div className="info">
          <Link to={`/player/${this.props.userid}`} target="blank" className="username">
            {this.props.username}
          </Link>
          <div className="timestamp">
            <span>{moment(this.props.timestamp).calendar()}</span>
          </div>
        </div>
        <div className="messageContent">
          <Linkify properties={{ target: 'blank' }}>
            {this.renderMessage(this.props.message, this.props.id)}
          </Linkify>
        </div>
      </div>
    );
  }
}

export default ChatMessage;
