import * as React from 'react';
import { Emoji } from 'emoji-mart';
import './style.css';

interface AutoCompletionsProps {
    autoCompleteIndex: number;
    emojiCompletions: string[];
    mentionCompletions: string[];
    completionClick: Function;
}

class AutoCompletion extends React.Component<AutoCompletionsProps, {}> {
    handleClick = (index: number) => {
        this.props.completionClick(index);
    }

    render() {
        if (this.props.emojiCompletions.length) {
            return (
                <div id="autoCompletionHolder">
                    {this.props.emojiCompletions.map((completion: string, index: number) =>
                        <div 
                            className={this.props.autoCompleteIndex === index ? 'autoCompletionItemHighlight' : ''} 
                            key={index}
                            onClick={() => this.handleClick(index)}
                        >
                            <Emoji emoji={`:${completion}:`} size={20} set="twitter" sheetSize={32} tooltip={true} />
                            <span>{`:${completion}:`}</span>
                        </div>
                    )}
                </div>
            );
        } else if (this.props.mentionCompletions.length) {
            return (
                <div id="autoCompletionHolder">
                    {this.props.mentionCompletions.map((completion: string, index: number) =>
                        <div 
                            className={this.props.autoCompleteIndex === index ? 'autoCompletionItemHighlight' : ''} 
                            key={index}
                            onClick={() => this.handleClick(index)}
                        >
                            <span>{`${completion}`}</span>
                        </div>
                    )}
                </div>
            );
        }

        return <div />;
    }
}

export default AutoCompletion;