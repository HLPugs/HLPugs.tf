import React from 'react';
import PreDraftRequirements from './PreDraftRequirements';
import { PreDraftRequirementType } from '../../../common/types';
import './style.scss';

interface DraftStateProps {
  socket: SocketIOClient.Socket;
}

interface DraftStateState {
  requirements: PreDraftRequirementType[];
  preDraftDetails: boolean;
}

class DraftState extends React.Component<DraftStateProps, DraftStateState> {
  constructor(props: DraftStateProps) {
    super(props);

    this.state = {
      requirements: [
        {
          name: 'Captains',
          state: true
        },
        {
          name: 'Players',
          state: false
        },
        {
          name: 'Roles',
          state: false
        },
        {
          name: 'Server',
          state: true
        }
      ],
      preDraftDetails: false
    };
  }

  togglePreDraftDetails = () => {
    this.setState({
      preDraftDetails: !this.state.preDraftDetails
    });
  }

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