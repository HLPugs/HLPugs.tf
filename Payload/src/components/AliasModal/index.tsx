import React from 'react';
import './style.scss';
import CheckIfAliasIsTakenRequest from '../../../../Common/Requests/CheckIfAliasIsTakenRequest';
import SubmitAliasRequest from '../../../../Common/Requests/SubmitAliasRequest';

interface AliasModalProps {
	socket: SocketIOClient.Socket;
}

interface AliasModalState {
	aliasIsTaken: boolean;
	invalidInput: boolean;
}

class AliasModal extends React.Component<AliasModalProps, AliasModalState> {
	protected checkAlias: number = 0;

	private readonly aliasInput: React.RefObject<HTMLInputElement>;

	constructor(props: AliasModalProps) {
		super(props);

		this.aliasInput = React.createRef();

		this.props.socket.on('checkIfAliasIsTaken', (aliasIsTaken: boolean) => {
			this.setState({ aliasIsTaken });
		});

		this.state = {
			aliasIsTaken: false,
			invalidInput: false
		};
	}

	handleInputChange = () => {
		if (!this.aliasInput.current) {
			return;
		}

		this.setState({
			invalidInput: !this.aliasInput.current.validity.valid
		});

		this.checkAlias = window.setTimeout(() => {
			if (!this.aliasInput.current) {
				return;
			}

			this.props.socket.emit('checkIfAliasIsTaken', {
				alias: this.aliasInput.current.value
			} as CheckIfAliasIsTakenRequest);
		}, 500);
	};

	submitAlias = () => {
		if (!this.aliasInput.current) {
			return;
		}

		this.props.socket.emit('submitAlias', {
			alias: this.aliasInput.current.value
		} as SubmitAliasRequest);
	};

	submitText = () => {
		if (this.state.invalidInput) {
			return 'Invalid';
		} else if (this.state.aliasIsTaken) {
			return 'Alias Taken';
		} else {
			return 'Set Alias';
		}
	};

	render() {
		return (
			<div id="AliasModalHolder">
				<div id="AliasModal">
					<span>
						Choose a <b>permanent</b> alias to continue to the site.
					</span>
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
							disabled={this.state.aliasIsTaken || this.state.invalidInput}
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
