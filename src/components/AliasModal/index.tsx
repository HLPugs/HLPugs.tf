import React from 'react';
import './style.scss';

interface AliasModalProps {
  socket: SocketIOClient.Socket;
}

interface AliasModalState {
  aliasTaken: boolean;
  invalidInput: boolean;
}

class AliasModal extends React.Component<AliasModalProps, AliasModalState> {

  protected checkAlias: number = 0;

  private readonly aliasInput: React.RefObject<HTMLInputElement>;

  constructor(props: AliasModalProps) {
    super(props);

    this.aliasInput = React.createRef();

    this.props.socket.on('aliasStatus', (aliasStatus: boolean) => {
      this.setState({
        aliasTaken: aliasStatus
      });
    });

    this.state = {
      aliasTaken: false,
      invalidInput: false
    };
  }

  handleInputChange = () => {
    if (!this.aliasInput.current) { return; }

    this.setState({
      invalidInput: !this.aliasInput.current.validity.valid
    });

    this.checkAlias = window.setTimeout(
      () => {
        if (!this.aliasInput.current) { return; }

        this.props.socket.emit('checkAlias', { alias: this.aliasInput.current.value });
      },
      500
    );
  }

  submitAlias = () => {
    if (!this.aliasInput.current) { return; }

    this.props.socket.emit('submitAlias', { alias: this.aliasInput.current.value });
  }

  submitText = () => {
    if (this.state.invalidInput) {
      return 'Invalid';
    } else if (this.state.aliasTaken) {
      return 'Alias Taken';
    } else {
      return 'Set Alias';
    }
  }

  render() {
    return (
      <div id="AliasModalHolder">
        <div id="AliasModal">
          <span>Choose a <b>permanent</b> alias to continue to the site.</span>
          <div>
            <input
              type="text"
              placeholder="Set your desired alias"
              minLength={2}
              maxLength={17}
              pattern="^[a-zA-Z0-9_]{2,17}$"
              ref={this.aliasInput}
              onChange={this.handleInputChange}
              autoFocus={true}
            />
            <button
              className="button"
              onClick={this.submitAlias}
              disabled={this.state.aliasTaken || this.state.invalidInput}
            >
              {this.submitText()}
            </button>
          </div>
          <span>Alias must be 2-17 characters using only alphanumeric and "_"</span>
        </div>
      </div>
    );
  }
}

export default AliasModal;
