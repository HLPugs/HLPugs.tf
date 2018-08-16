import * as React from 'react';
import AutoCompletions from './AutoCompletions';
import EmojiPicker from './EmojiPicker';
import { EmojiData, CustomEmoji } from 'emoji-mart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CompletionItem } from '../../../common/types';
import { SearchEmojis, SearchMentions } from './SearchCompletions';
import './style.css';

interface ChatInputProps {
  socket: SocketIOClient.Socket;
  loggedIn?: boolean;
  customEmojis: CustomEmoji[];
  mentions: string[];
}

interface ChatInputState {
  pickerToggle: boolean;
  toggleWaitComplete: boolean;
  autoCompleteIndex: number;
  emojiCompletions: CompletionItem[];
  mentionCompletions: string[];
  lastMessageSentTimestamp: number;
}

class ChatInput extends React.Component<ChatInputProps, ChatInputState> {

  private messageInput: React.RefObject<HTMLTextAreaElement>;

  constructor(props: ChatInputProps) {
    super(props);

    this.messageInput = React.createRef();

    this.state = {
      pickerToggle: false,
      toggleWaitComplete: true,
      autoCompleteIndex: 0,
      emojiCompletions: [],
      mentionCompletions: [],
      lastMessageSentTimestamp: 0
    };
  }

  addEmoji = (emoji: EmojiData) => {
    if (!this.messageInput.current) { return; }

    let prefix = '';

    if (this.messageInput.current.value) {
      if (this.messageInput.current.value.substring(this.messageInput.current.value.length - 1) !== ' ') {
        // if last character in message isn't a space, put one before the emoji
        prefix = ' ';
      }
    }

    this.messageInput.current.value += `${prefix}${emoji.colons} `;

    this.handleChange();

    this.setState({
      pickerToggle: false
    });

    this.messageInput.current.focus();
  }

  executeCompletion = (index: number) => {
    if (!this.messageInput.current) { return; }

    const tokens: string[] = this.messageInput.current.value.split(/\s/g);
    const fragment: string = tokens[tokens.length - 1];
    const messagePartial = this.messageInput.current.value.substring(
      0, this.messageInput.current.value.length - fragment.length);
    let completion = '';

    if (fragment.startsWith(':') && this.state.emojiCompletions.length) {
      const emojiName = this.state.emojiCompletions[index].name ?
        this.state.emojiCompletions[index].name : this.state.emojiCompletions[index].customName;
      completion = `:${emojiName}: `;
    } else if (fragment.startsWith('@') && this.state.mentionCompletions.length) {
      completion = `@${this.state.mentionCompletions[index]} `;
    }

    this.messageInput.current.value = `${messagePartial}${completion}`;

    this.setState({
      autoCompleteIndex: 0,
      emojiCompletions: [],
      mentionCompletions: []
    });

    this.messageInput.current.focus();
  }

  handleChange = () => {
    if (!this.messageInput.current) { return; }

    const tokens: string[] = this.messageInput.current.value.split(/\s/g);

    const fragment: string = tokens[tokens.length - 1];

    if (fragment && (fragment.startsWith('@') || fragment.startsWith(':'))) {
      fragment.startsWith(':') ? 
        this.setState(SearchEmojis(fragment, this.props.customEmojis)) :
        this.setState(SearchMentions(fragment, this.props.mentions));
    } else {
      this.setState({
        autoCompleteIndex: 0,
        emojiCompletions: [],
        mentionCompletions: []
      });
    }
  }

  handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!this.messageInput.current) { return; }

    const tokens: string[] = this.messageInput.current.value.split(/\s/g);

    const fragment: string = tokens[tokens.length - 1];

    if (this.state.emojiCompletions.length || this.state.mentionCompletions.length) {
      // If completions are active
      if (event.key === 'Enter' || event.key === 'Tab') {
        // Execute current completion
        event.preventDefault();
        this.executeCompletion(this.state.autoCompleteIndex);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();

        this.shiftCompletionIndex(fragment, -1);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();

        this.shiftCompletionIndex(fragment, 1);
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();

      this.sendMessage();
    }
  }

  sendMessage = () => {
    if (!this.messageInput.current) { return; }

    if (this.messageInput.current.value.length && Date.now() - this.state.lastMessageSentTimestamp > 1000) {
      this.props.socket.emit('sendMessage', this.messageInput.current.value);

      this.setState({
        lastMessageSentTimestamp: Date.now()
      });

      this.messageInput.current.value = '';
      this.handleChange();
    }
  }

  shiftCompletionIndex = (fragment: string, delta: number) => {
    const newIndex = this.state.autoCompleteIndex + delta;
    const completionsLength = Math.max(this.state.emojiCompletions.length, this.state.mentionCompletions.length);
    let newAutoCompleteIndex = 0;

    if (newIndex < 0) {
      newAutoCompleteIndex = completionsLength + newIndex;
    } else if (newIndex >= completionsLength) {
      newAutoCompleteIndex = newIndex - completionsLength;
    } else {
      newAutoCompleteIndex = newIndex;
    }

    this.setState({
      autoCompleteIndex: newAutoCompleteIndex
    });
  }

  togglePicker = () => {
    if (!this.state.toggleWaitComplete) { return; }

    this.setState({
      pickerToggle: !this.state.pickerToggle,
      toggleWaitComplete: false
    });

    window.setTimeout(
      () => {
        this.setState({
          toggleWaitComplete: true
        });
      },
      200
    );
  }

  render() {
    return (
      <div id="inputHolder">
        <textarea
          placeholder={this.props.loggedIn ? '@Support for serious concerns' : 'Login to chat!'}
          id="messageInput"
          ref={this.messageInput}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyPress}
          maxLength={300}
          disabled={!this.props.loggedIn}
        />
        <AutoCompletions
          autoCompleteIndex={this.state.autoCompleteIndex}
          emojiCompletions={this.state.emojiCompletions}
          mentionCompletions={this.state.mentionCompletions}
          completionClick={this.executeCompletion}
        />
        <div id="emojiPickerToggle" onClick={this.props.loggedIn ? this.togglePicker : undefined} >
          <FontAwesomeIcon icon="grin-alt" />
        </div>
        <div id="messageCharacterCount">
          {
            this.messageInput.current ?
              this.messageInput.current.maxLength - this.messageInput.current.value.length : 300
          }
        </div>
        <div id="emojiPickerHolder">
          <EmojiPicker
            addEmoji={this.addEmoji}
            handleClickOutside={this.togglePicker}
            pickerToggle={this.state.pickerToggle}
            customEmojis={this.props.customEmojis}
          />
        </div>
      </div>
    );
  }
}

export default ChatInput;