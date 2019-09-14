import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import Region from '../../../Common/Enums/Region';

export interface PreDraftRequirementType {
	name: string;
	state: boolean;
}

export interface CompletionItem {
	name?: string;
	customName?: string;
	url?: string;
}
