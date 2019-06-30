import React from 'react';
import { Picker, EmojiData, CustomEmoji } from 'emoji-mart';
import onClickOutside, { InjectedOnClickOutProps } from 'react-onclickoutside';
import './emoji-mart.scss';

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
    if (!this.props.pickerToggle) { return null; }

    return (
      <Picker
        custom={this.props.customEmojis}
        set="twitter"
        perLine={7}
        color="var(--color)"
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
}

export default onClickOutside(EmojiPicker);