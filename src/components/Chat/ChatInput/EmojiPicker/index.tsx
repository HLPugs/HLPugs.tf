import * as React from 'react';
import { Picker, EmojiData, CustomEmoji } from 'emoji-mart';
import onClickOutside, { InjectedOnClickOutProps } from 'react-onclickoutside';
import './emoji-mart.css';

interface EmojiPickerProps {
    pickerToggle: boolean;
    addEmoji: Function;
    handleClickOutside: Function;
    customEmojis: CustomEmoji[];
}

class EmojiPicker extends React.Component<EmojiPickerProps & InjectedOnClickOutProps, {}> {
    handleClickOutside = () => {
        this.props.handleClickOutside();
    }

    render() {
        if (this.props.pickerToggle) {
            return (
                <Picker
                    custom={this.props.customEmojis}
                    set="twitter"
                    perLine={7}
                    color="#03a9f4"
                    sheetSize={32}
                    autoFocus={true}
                    emojiTooltip={false}
                    onClick={(emoji: EmojiData) => { this.props.addEmoji(emoji); }}
                    include={
                        [
                            'recent', 
                            'custom', 
                            'people', 
                            'nature', 
                            'foods', 
                            'activity', 
                            'places', 
                            'objects', 
                            'symbols', 
                            'flags'
                        ]
                    }
                />
            );
        }

        return null;
    }  
}

export default onClickOutside(EmojiPicker);