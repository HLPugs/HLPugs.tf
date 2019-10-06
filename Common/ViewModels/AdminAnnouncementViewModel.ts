import Region from '../Enums/Region';
import { IsString, IsEnum, IsNumber } from 'class-validator';
import Announcement from '../../Intel/src/entities/Announcement';
import ValidateClass from '../../Intel/src/utils/ValidateClass';

export default class AdminAnnouncementViewModel {
	@IsNumber()
	id: number;

	@IsNumber()
	order: number;

	@IsString()
	messageContent: string;

	@IsEnum(Region)
	region: Region;

	static fromAnnouncement(announcement: Announcement) {
		return ValidateClass<AdminAnnouncementViewModel>({
			id: announcement.id,
			messageContent: announcement.messageContent,
			region: announcement.region,
			order: announcement.order
		});
	}
}
