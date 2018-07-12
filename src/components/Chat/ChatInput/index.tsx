import * as React from 'react';
import AutoComletions from './AutoCompletions';
import EmojiPicker from './EmojiPicker';
import { EmojiData } from 'emoji-mart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import allEmojis from 'emoji-mart/data/all.json';
import './style.css';

const searchEmojis = (
    fragment: string,
    input: React.RefObject<HTMLTextAreaElement>
) => {
    const query = fragment.slice(1);
    
    if (fragment.startsWith(':') && query.length > 1) {
        let completions: string[] = [];

        for (const emoji in allEmojis.emojis) {
            if (emoji.substring(0, query.length) === query) {
                completions.push(emoji);
                
                if (completions.length >= 8) {
                    break;
                }
            }
        }

        if (completions.length < 8) {
            for (const emoji in allEmojis.emojis) {
                if (emoji.includes(query) && completions.indexOf(emoji) === -1) {
                    completions.push(emoji);

                    if (completions.length >= 8) {
                        break;
                    }
                }
            }
        }

        return {
            autoCompleteIndex: 0,
            emojiCompletions: completions
        };
    }

    return {
        autoCompleteIndex: 0,
        emojiCompletions: []
    };
};

interface ChatInputProps {
    socket: SocketIOClient.Socket;
}

interface ChatInputState {
    pickerToggle: boolean;
    autoCompleteIndex: number;
    emojiCompletions: string[];
    mentionCompletions: string[];
}

class ChatInput extends React.Component<ChatInputProps, ChatInputState> {

    private messageInput: React.RefObject<HTMLTextAreaElement>;

    constructor(props: ChatInputProps) {
        super(props);

        this.messageInput = React.createRef();

        this.state = {
            pickerToggle: false,
            autoCompleteIndex: 0,
            emojiCompletions: [],
            mentionCompletions: []
        };
    }

    togglePicker = () => {
        this.setState({
            pickerToggle: !this.state.pickerToggle
        });
    }

    addEmoji = (emoji: EmojiData) => {
        if (this.messageInput.current) {
            if (this.messageInput.current.value) {
                if (this.messageInput.current.value.substring(this.messageInput.current.value.length - 1) === ' ') {
                    this.messageInput.current.value += emoji.colons + ' ';
                } else {
                    this.messageInput.current.value += ' ' + emoji.colons + ' ';
                }
            } else {
                this.messageInput.current.value = emoji.colons + ' ';
            }

            this.handleChange();
        }

        this.setState({
            pickerToggle: false
        });

        if (this.messageInput.current) {
            this.messageInput.current.focus();
        }
    }

    handleChange = () => {
        if (this.messageInput.current) {
            const tokens: string[] = this.messageInput.current.value.split(/\s/g);

            const fragment: string = tokens[tokens.length - 1];

            if (fragment && (fragment.startsWith('@') || fragment.startsWith(':'))) {
                this.setState(searchEmojis(fragment, this.messageInput));
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

            if (event.key === 'Enter' && !event.shiftKey && !(fragment.startsWith(':') || fragment.startsWith('@'))) {
                event.preventDefault();

                // Submit text to socket

                this.messageInput.current.value = '';
                this.handleChange();
            } else if (fragment.startsWith(':') || fragment.startsWith('@')) {
                if (event.key === 'Enter' || event.key === 'Tab') {
                    event.preventDefault();

                    if (fragment.startsWith(':') && this.state.emojiCompletions.length) {
                        this.messageInput.current.value = this.messageInput.current.value.substring(
                            0, this.messageInput.current.value.length - fragment.length
                        ) + `:${this.state.emojiCompletions[this.state.autoCompleteIndex]}: `;
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
            if (fragment.startsWith(':') && this.state.emojiCompletions.length) {
                this.messageInput.current.value = this.messageInput.current.value.substring(
                    0, this.messageInput.current.value.length - fragment.length
                ) + `:${this.state.emojiCompletions[index]}: `;
            } else if (fragment.startsWith('@') && this.state.mentionCompletions.length) {
                this.messageInput.current.value = this.messageInput.current.value.substring(
                    0, this.messageInput.current.value.length - fragment.length
                ) + `:${this.state.mentionCompletions[index]}: `;
            }

            this.setState({
                autoCompleteIndex: 0,
                emojiCompletions: [],
                mentionCompletions: []
            });
        }
    }

    render() {
        return (
            <div id="inputHolder">
                <textarea 
                    placeholder="@Support for serious concerns" 
                    id="messageInput" 
                    ref={this.messageInput}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyPress}
                />
                <div id="emojiPickerToggle" onClick={this.togglePicker} >
                    <FontAwesomeIcon icon="smile" />
                </div>
                <AutoComletions 
                    autoCompleteIndex={this.state.autoCompleteIndex} 
                    emojiCompletions={this.state.emojiCompletions}
                    mentionCompletions={this.state.mentionCompletions}
                    completionClick={this.completionClick}
                />
                <div id="emojiPickerHolder">
                    <EmojiPicker 
                        addEmoji={this.addEmoji} 
                        handleClickOutside={this.togglePicker} 
                        pickerToggle={this.state.pickerToggle} 
                    />
                </div>
            </div>
        );
    }
}

export default ChatInput;