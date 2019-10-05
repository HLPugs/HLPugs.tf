import React from 'react';
import PreDraftRequirements from './PreDraftRequirements';
import './style.scss';
import PlayerViewModel from '../../../../../Common/ViewModels/PlayerViewModel';
import PreDraftRequirementViewModel from '../../../../../Common/ViewModels/PreDraftRequirementViewModel';

interface DraftStateProps {
	socket: SocketIOClient.Socket;
}

interface DraftStateState {
	requirements: PreDraftRequirementViewModel[];
	preDraftDetails: boolean;
}

class DraftState extends React.Component<DraftStateProps, DraftStateState> {
	constructor(props: DraftStateProps) {
		super(props);

		this.state = {
			requirements: [
				{
					requirementName: 'Captains',
					isFulfilled: false
				},
				{
					requirementName: 'Players',
					isFulfilled: false
				},
				{
					requirementName: 'Classes',
					isFulfilled: false
				},
				{
					requirementName: 'Server',
					isFulfilled: false
				}
			],
			preDraftDetails: false
		};

		this.props.socket.on('sendNewDraftRequirements', (requirements: PreDraftRequirementViewModel[]) => {
			this.setState({ requirements });
		});
	}

	togglePreDraftDetails = () => {
		this.setState({
			preDraftDetails: !this.state.preDraftDetails
		});
	};

	render() {
		return (
			<div
				id="draftState"
				className={this.state.preDraftDetails ? 'preDraftDetails' : ''}
				onClick={this.togglePreDraftDetails}
			>
				<div id="draftStateBar" />
				<PreDraftRequirements requirements={this.state.requirements} />
			</div>
		);
	}
}

export default DraftState;
