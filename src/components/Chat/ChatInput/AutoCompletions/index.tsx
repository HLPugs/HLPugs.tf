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
    handleClick = (index: number) => {
        this.props.completionClick(index);
    }

    render() {
        if (this.props.emojiCompletions.length) {
            return (
                <div id="autoCompletionHolder">
                    {this.props.emojiCompletions.map((completion: CompletionItem, index: number) => {
                            if (completion.name) {
                                return (
                                    <div 
                                        className={
                                            this.props.autoCompleteIndex === index ? 'autoCompletionItemHighlight' : ''
                                        } 
                                        key={index}
                                        onClick={() => this.handleClick(index)}
                                    >
                                        <Emoji 
                                            emoji={`:${completion.name}:`} 
                                            size={20} 
                                            set="twitter" 
                                            sheetSize={32} 
                                            tooltip={true} 
                                        />
                                        <span>{`:${completion.name}:`}</span>
                                    </div>
                                );
                            } else if (completion.customName) {
                                return (
                                    <div
                                        className={
                                            this.props.autoCompleteIndex === index ? 'autoCompletionItemHighlight' : ''
                                        }
                                        key={index}
                                        onClick={() => this.handleClick(index)}
                                    >
                                        <span
                                            title={completion.customName}
                                            className="emoji-mart-emoji"
                                            key={index}
                                        >
                                            <span 
                                                className="customEmoji" 
                                                style={{ backgroundImage: `url(${completion.url})` }} 
                                            />
                                        </span>
                                        <span>{`:${completion.customName}:`}</span>
                                    </div>
                                );
                            } else {
                                return null;
                            }
                        }
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