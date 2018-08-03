import * as React from 'react';
import { Emoji } from 'emoji-mart';
import { CompletionItem } from '../../../../common/types';
import './style.css';

interface AutoCompletionsProps {
  autoCompleteIndex: number;
  emojiCompletions: CompletionItem[];
  mentionCompletions: string[];
  completionClick: Function;
}

class AutoCompletion extends React.Component<AutoCompletionsProps, {}> {
  completionsCollection = () => {
    if (this.props.emojiCompletions.length) {
      return (
        <>
          {this.props.emojiCompletions.map((completion: CompletionItem, index: number) =>
            this.createCompletion(index, completion)
          )}
        </>
      );
    } else if (this.props.mentionCompletions.length) {
      return (
        <>
          {this.props.mentionCompletions.map((completion: string, index: number) =>
            this.createCompletion(index, completion)
          )}
        </>
      );
    }
    return null;
  }

  createCompletion = (index: number, completion: string | CompletionItem) => {
    return (
      <div
        className={this.props.autoCompleteIndex === index ? 'autoCompletionItemHighlight' : ''}
        key={index}
        onClick={() => this.handleClick(index)}
      >
        {this.createCompletionContent(completion)}
      </div>
    );
  }

  createCompletionContent = (completion: string | CompletionItem) => {
    if (typeof completion === 'string') {
      return <span>{completion}</span>;
    } else if (completion.name) {
      return (
        <>
          <Emoji
            emoji={`:${completion.name}:`}
            size={20}
            set="twitter"
            sheetSize={32}
            tooltip={true}
          />
          <span>{`:${completion.name}:`}</span>
        </>
      );
    } else if (completion.customName) {
      return (
        <>
          <span
            title={completion.customName}
            className="emoji-mart-emoji"
          >
            <span
              className="customEmoji"
              style={{ backgroundImage: `url(${completion.url})` }}
            />
          </span>
          <span>{`:${completion.customName}:`}</span>
        </>
      );
    }
    return null;
  }

  handleClick = (index: number) => {
    this.props.completionClick(index);
  }

  render() {
    if (this.props.emojiCompletions.length || this.props.mentionCompletions.length) {
      return (
        <div id="autoCompletionHolder">
          {this.completionsCollection()}
        </div>
      );
    }
    return <div />;
  }
}

export default AutoCompletion;