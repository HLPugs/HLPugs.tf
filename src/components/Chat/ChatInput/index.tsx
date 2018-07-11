import * as React from 'react';
import './style.css';
import './emoji-mart.css';
import { Picker, EmojiData } from 'emoji-mart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ChatInputProps {
    socket: SocketIOClient.Socket;
}

interface ChatInputState {
    pickerToggle: boolean;
}

class ChatInput extends React.Component<ChatInputProps, ChatInputState> {

    private messageInput: React.RefObject<HTMLTextAreaElement>;

    constructor(props: ChatInputProps) {
        super(props);

        this.messageInput = React.createRef();

        this.state = {
            pickerToggle: false
        };
    }

    togglePicker = () => {
        this.setState({
            pickerToggle: !this.state.pickerToggle
        });
    }

    addEmoji = (emoji: EmojiData) => {
        /* tslint:disable */
        console.log(emoji);
        /* tslint:enable */
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
        }
    }

    picker = () => {
        if (this.state.pickerToggle) {
            return  (
                <Picker
                    custom={[]}
                    set="twitter"
                    perLine={7}
                    color="#03a9f4"
                    sheetSize={32}
                    autoFocus={true}
                    onClick={(emoji) => { this.addEmoji(emoji); }}
                />
            );
        }

        return null;
    }

    render() {
        return (
            <div id="inputHolder">
                <textarea 
                    placeholder="@Support for serious concerns" 
                    id="messageInput" 
                    ref={this.messageInput}
                    onClick={() => { this.setState({pickerToggle: false}); }} 
                />
                <div id="emojiPickerToggle" onClick={this.togglePicker} >
                    <FontAwesomeIcon icon="smile" />
                </div>
                <div id="emojiPickerHolder">
                    {this.picker()}
                </div>
            </div>
        );
    }
}

export default ChatInput;