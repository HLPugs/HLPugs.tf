import React from 'react';
import { FontAwesomeIcon } from '../../../../../../node_modules/@fortawesome/react-fontawesome';
import './style.scss';
import PreDraftRequirementsViewModel from '../../../../../../../Common/ViewModels/PreDraftRequirementViewModel';

interface PreDraftRequirementItemProps {
	state: PreDraftRequirementsViewModel;
}

class PreDraftRequirementItem extends React.Component<PreDraftRequirementItemProps, {}> {
	render() {
		return (
			<div className="preDraftRequirementItem">
				<FontAwesomeIcon icon={this.props.state.isFulfilled ? 'check' : 'times'} />
				<span>{this.props.state.requirementName}</span>
			</div>
		);
	}
}

export default PreDraftRequirementItem;
