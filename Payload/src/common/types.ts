import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import Region from '../../../Common/Enums/Region';

export interface ChatMessageType {
	username: string;
	userid: string;
	id: string;
	timestamp: number;
	message: string;
}

export interface PreDraftRequirementType {
	name: string;
	state: boolean;
}

export interface CompletionItem {
	name?: string;
	customName?: string;
	url?: string;
}

export interface BasicAnnouncement {
	content: string;
	priority: boolean;
}

export interface FullAnnouncement extends BasicAnnouncement {
	id: number;
	region: Region;
	creator: string;
	timestamp: Date;
}
