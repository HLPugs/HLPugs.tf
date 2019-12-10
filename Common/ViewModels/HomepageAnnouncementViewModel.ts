import AnnouncementEntity from '../../Intel/src/entities/AnnouncementEntity';
import { IsString, IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';
import ValidateClass from '../../Intel/src/utils/ValidateClass';

export default class HomepageAnnouncementViewModel {
	@IsString()
	messageContent: string;

	@IsBoolean()
	priority: boolean;
}
