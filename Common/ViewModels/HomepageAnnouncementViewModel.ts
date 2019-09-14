import Announcement from '../../Intel/src/entities/Announcement';
import { IsString, IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';
import ValidateClass from '../../Intel/src/utils/ValidateClass';

export default class HomepageAnnouncementViewModel {
	@IsString()
	messageContent: string;

	@IsBoolean()
	priority: boolean;

	static fromAnnouncement(announcement: Announcement) {
		return ValidateClass<HomepageAnnouncementViewModel>({
			messageContent: announcement.messageContent,
			priority: announcement.priority,
		});
	}
}
