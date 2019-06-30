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

class Loading extends React.PureComponent<LoadingProps, LoadingState> {
  messageTimeouts: number[];

  constructor(props: LoadingProps) {
    super(props);

    this.messageTimeouts = this.props.loadingMessages.map(loadingMessage =>
      window.setTimeout(
        () => {
          this.setState({
            loadingMessage: loadingMessage.message
          });
        },
        loadingMessage.timeout * 1000
      )
    );

    this.state = {
      loadingMessage: ''
    };
  }

  componentWillUnmount() {
    this.messageTimeouts.forEach(clearTimeout);
  }

  render() {
    return (
      <div id="loadingHolder">
        <div id="loadingDots">
          <div className="loadingDotHolder">
            <div className="loadingDot" />
          </div>
          <div className="loadingDotHolder" style={{ '--delay': '.1s' } as React.CSSProperties}>
            <div className="loadingDot" />
          </div>
          <div className="loadingDotHolder" style={{ '--delay': '.2s' } as React.CSSProperties}>
            <div className="loadingDot" />
          </div>
        </div>
        <div id="loadingDescription">
          {this.state.loadingMessage}
        </div>
      </div>
    );
  }
}

export default Loading;