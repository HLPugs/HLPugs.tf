import * as React from 'react';
import { Picker, EmojiData } from 'emoji-mart';
import onClickOutside, { InjectedOnClickOutProps } from 'react-onclickoutside';
import './emoji-mart.css';

interface EmojiPickerProps {
    pickerToggle: boolean;
    addEmoji: Function;
    handleClickOutside: Function;
}

class EmojiPicker extends React.Component<EmojiPickerProps & InjectedOnClickOutProps, {}> {
    handleClickOutside = () => {
        this.props.handleClickOutside();
    }

    render() {
        if (this.props.pickerToggle) {
            return (
                <Picker
                    custom={[]}
                    set="twitter"
                    perLine={7}
                    color="#03a9f4"
                    sheetSize={32}
                    autoFocus={true}
                    emojiTooltip={true}
                    onClick={(emoji: EmojiData) => { this.props.addEmoji(emoji); }}
                />
            );
        }

        return null;
    }  
}

export default onClickOutside(EmojiPicker);