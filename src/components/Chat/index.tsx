import * as React from 'react';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { CustomEmoji } from 'emoji-mart';
import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserScheme } from '../../common/types';
import { PlayerDataConsumer } from '../../pages/Home';

interface ChatProps {
  socket: SocketIOClient.Socket;
  user: UserScheme;
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
  }

  render() {
    return (
      <PlayerDataConsumer>
        {(playerData) => (
          <aside className={this.state.active ? 'chatActive' : ''}>
            <div id="chatOpener" onClick={this.toggleChat}>
              <FontAwesomeIcon icon="comments" />
            </div>
            <ChatMessages
              socket={this.props.socket}
              customEmojis={this.state.customEmojis}
              steamid={this.props.user.steamid}
              alias={this.props.user.alias}
            />
            <ChatInput
              socket={this.props.socket}
              loggedIn={this.props.user.loggedIn}
              customEmojis={this.state.customEmojis}
              mentions={playerData ? Object.keys(playerData).map(p => playerData[p].alias) : []}
            />
          </aside>
        )}
      </PlayerDataConsumer>
    );
  }
}

export default Chat;