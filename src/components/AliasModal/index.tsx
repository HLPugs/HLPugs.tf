import * as React from 'react';
import './style.css';

interface AliasModalProps {
    socket: SocketIOClient.Socket;
}

interface AliasModalState {
    aliasTaken: boolean;
}

class AliasModal extends React.Component<AliasModalProps, AliasModalState> {

    protected checkAlias: number;

    private aliasInput: React.RefObject<HTMLInputElement>;

    constructor(props: AliasModalProps) {
        super(props);

        this.aliasInput = React.createRef();

        this.props.socket.on('aliasStatus', (aliasStatus: boolean) => {
            this.setState({
                aliasTaken: aliasStatus
            });
        });

        this.state = {
            aliasTaken: false
        };
    }

    handleInputChange = () => {
        this.checkAlias = setTimeout(
            () => {
                if (this.aliasInput.current) {
                    this.props.socket.emit('checkAlias', this.aliasInput.current.value);
                }
            },
            500
        );
    }

    submitAlias = () => {
        if (this.aliasInput.current) {
            this.props.socket.emit('submitAlias', this.aliasInput.current.value);
        }
    }

    aliasTaken = () => {
        if (this.state.aliasTaken) {
            return <span className="aliasTaken">Alias taken!</span>;
        }

        return null;
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
                        />
                        <button className="button-primary" onClick={this.submitAlias}>Set Alias</button>
                    </div>
                    {this.aliasTaken()}
                    <span>Alias must be 2-17 characters using only alphanumeric + _</span>
                </div>
            </div>
        );
    }
}

export default AliasModal;