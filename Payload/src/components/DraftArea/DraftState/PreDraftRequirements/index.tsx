import React from 'react';
import PreDraftRequirementItem from './PreDraftRequirementItem';
import './style.scss';
import PreDraftRequirementViewModel from '../../../../../../Common/ViewModels/PreDraftRequirementViewModel';
interface PreDraftRequirementsProps {
	requirements: PreDraftRequirementViewModel[];
}

class PreDraftRequirements extends React.Component<PreDraftRequirementsProps, {}> {
	render() {
		return (
			<div id="PreDraftRequirements">
				{this.props.requirements.map((requirement: PreDraftRequirementViewModel) => (
					<PreDraftRequirementItem state={requirement} key={requirement.requirementName} />
				))}
			</div>
		);
	}
}

export default PreDraftRequirements;
