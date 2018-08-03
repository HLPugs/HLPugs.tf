import * as React from 'react';
import AutoCompletions from './AutoCompletions';
import EmojiPicker from './EmojiPicker';
import { EmojiData, CustomEmoji } from 'emoji-mart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CompletionItem } from '../../../common/types';
import SearchEmojis from './SearchEmojis';
import './style.css';

interface ChatInputProps {
    socket: SocketIOClient.Socket;
    loggedIn?: boolean;
    customEmojis: CustomEmoji[];
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

    togglePicker = () => {
        if (this.state.toggleWaitComplete) {
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
    }

    addEmoji = (emoji: EmojiData) => {
        if (this.messageInput.current) {
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
    }

    handleChange = () => {
        if (this.messageInput.current) {
            const tokens: string[] = this.messageInput.current.value.split(/\s/g);

            const fragment: string = tokens[tokens.length - 1];

            if (fragment && (fragment.startsWith('@') || fragment.startsWith(':'))) {
                this.setState(SearchEmojis(fragment, this.messageInput, this.props.customEmojis));
            } else {
                this.setState({
                    autoCompleteIndex: 0,
                    emojiCompletions: [],
                    mentionCompletions: []
                });
            }
        }
    }

    handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (this.messageInput.current) {
            const tokens: string[] = this.messageInput.current.value.split(/\s/g);

            const fragment: string = tokens[tokens.length - 1];

            if (event.key === 'Enter' && 
            !(this.state.emojiCompletions.length || this.state.mentionCompletions.length)) {
                event.preventDefault();
                if (this.messageInput.current.value.length && Date.now() - this.state.lastMessageSentTimestamp > 1000) {
                    this.props.socket.emit('sendMessage', this.messageInput.current.value);

                    this.setState({
                        lastMessageSentTimestamp: Date.now()
                    });

                    this.messageInput.current.value = '';
                    this.handleChange();
                }
            } else if (this.state.emojiCompletions.length || this.state.mentionCompletions.length) {
                if (event.key === 'Enter' || event.key === 'Tab') {
                    event.preventDefault();

                    if (fragment.startsWith(':') && this.state.emojiCompletions.length) {
                        const emojiName = this.state.emojiCompletions[this.state.autoCompleteIndex].name ?
                            this.state.emojiCompletions[this.state.autoCompleteIndex].name : 
                            this.state.emojiCompletions[this.state.autoCompleteIndex].customName;
                        
                        this.messageInput.current.value = this.messageInput.current.value.substring(
                            0, this.messageInput.current.value.length - fragment.length
                        ) + `:${emojiName}: `;
                    } else if (fragment.startsWith('@') && this.state.mentionCompletions.length) {
                        this.messageInput.current.value = this.messageInput.current.value.substring(
                            0, this.messageInput.current.value.length - fragment.length
                        ) + `:${this.state.mentionCompletions[this.state.autoCompleteIndex]}: `;
                    }

                    this.setState({
                        autoCompleteIndex: 0,
                        emojiCompletions: [],
                        mentionCompletions: []
                    });
                } else if (event.key === 'ArrowUp') {
                    event.preventDefault();

                    if (this.state.autoCompleteIndex === 0) {
                        if (fragment.startsWith(':')) {
                            this.setState({
                                autoCompleteIndex: this.state.emojiCompletions.length - 1
                            });
                        } else if (fragment.startsWith('@')) {
                            this.setState({
                                autoCompleteIndex: this.state.mentionCompletions.length - 1
                            });
                        }
                    } else {
                        this.setState({
                            autoCompleteIndex: this.state.autoCompleteIndex - 1
                        });
                    }
                } else if (event.key === 'ArrowDown') {
                    event.preventDefault();

                    if (fragment.startsWith(':')) {
                        if (this.state.autoCompleteIndex === this.state.emojiCompletions.length - 1) {
                            this.setState({
                                autoCompleteIndex: 0
                            });
                        } else {
                            this.setState({
                                autoCompleteIndex: this.state.autoCompleteIndex + 1
                            });
                        }
                    } else if (fragment.startsWith('@')) {
                        if (this.state.autoCompleteIndex === this.state.mentionCompletions.length - 1) {
                            this.setState({
                                autoCompleteIndex: 0
                            });
                        } else {
                            this.setState({
                                autoCompleteIndex: this.state.autoCompleteIndex + 1
                            });
                        }
                    }
                }
            }
        }
    }

    completionClick = (index: number) => {
        if (this.messageInput.current) {
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
                    completionClick={this.completionClick}
                />
                <div id="emojiPickerToggle" onClick={this.props.loggedIn ? this.togglePicker : undefined} >
                    <FontAwesomeIcon icon="smile" />
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