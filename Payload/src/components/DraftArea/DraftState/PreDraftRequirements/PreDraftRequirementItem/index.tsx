import React from 'react';
import { PreDraftRequirementType } from '../../../../../common/types';
import { FontAwesomeIcon } from '../../../../../../node_modules/@fortawesome/react-fontawesome';
import './style.scss';

interface PreDraftRequirementItemProps {
  state: PreDraftRequirementType;
}

class PreDraftRequirementItem extends React.Component<PreDraftRequirementItemProps, {}> {
  render() {
    return (
      <div className="preDraftRequirementItem">
        <FontAwesomeIcon icon={this.props.state.state ? 'check' : 'times'} />
        <span>{this.props.state.name}</span>
      </div>
    );
  }
}

export default PreDraftRequirementItem;