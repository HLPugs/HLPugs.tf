import React from 'react';
import PreDraftRequirementItem from './PreDraftRequirementItem';
import { PreDraftRequirementType } from '../../../../common/types';
import './style.scss';

interface PreDraftRequirementsProps {
  requirements: PreDraftRequirementType[];
}

class PreDraftRequirements extends React.Component<PreDraftRequirementsProps, {}> {
  render() {
    return (
      <div id="PreDraftRequirements">
        {this.props.requirements.map((requirement: PreDraftRequirementType) =>
          <PreDraftRequirementItem state={requirement} key={requirement.name} />
        )}
      </div>
    );
  }
}

export default PreDraftRequirements;