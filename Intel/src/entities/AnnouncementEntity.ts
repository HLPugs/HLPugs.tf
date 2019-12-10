import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from 'typeorm';
import { IsEnum, IsString, IsNumberString, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import Region from '../../../Common/Enums/Region';
import SteamID from '../../../Common/Types/SteamID';
import ValidateClass from '../utils/ValidateClass';
import HomepageAnnouncementViewModel from '../../../Common/ViewModels/HomepageAnnouncementViewModel';

@Entity('announcements')
export default class AnnouncementEntity {
	@PrimaryGeneratedColumn()
	@IsOptional()
	@IsNumber()
	id?: number;

	@Column()
	@IsNumber()
	order: number;

	@Column()
	@IsString()
	@IsNotEmpty()
	messageContent: string;

	@Column()
	@IsEnum(Region)
	region: Region;

	@Column()
	@IsNumberString()
	creatorSteamid: SteamID;

	@Column({ default: false })
	@IsBoolean()
	priority: boolean;

	@Column()
	@IsDate()
	timestamp?: Date;

	static toHomepageAnnouncementViewModel(announcement: AnnouncementEntity) {
		return ValidateClass<HomepageAnnouncementViewModel>({
			messageContent: announcement.messageContent,
			priority: announcement.priority
		});
	}
}
