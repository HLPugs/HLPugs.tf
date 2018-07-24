import * as React from 'react';
import './style.css';

interface LoadingMessage {
    message: string;
    timeout: number;
}

interface LoadingProps {
    loadingMessages: LoadingMessage[];
}

interface LoadingState {
    loadingMessage: string;
}

class Loading extends React.Component<LoadingProps, LoadingState> {
    constructor(props: LoadingProps) {
        super(props);

        for (const loadingMessage of this.props.loadingMessages) {
            setTimeout(
                () => {
                    this.setState({
                        loadingMessage: loadingMessage.message
                    });
                },
                loadingMessage.timeout * 1000
            );
        }

        this.state = {
            loadingMessage: ''
        };
    }

    render() {
        return (
            <div id="loadingHolder">
                <div id="loadingDots">
                    <div className="loadingDot"/>
                    <div className="loadingDot" style={{ animationDelay: '.1s' }}/>
                    <div className="loadingDot" style={{ animationDelay: '.2s' }} />
                </div>
                <div id="loadingDescription">
                    {this.state.loadingMessage}
                </div>
            </div>
        );
    }
}

export default Loading;