import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEnum, IsString, IsNumberString, IsBoolean, IsDate, IsNotEmpty } from 'class-validator';
import Region from '../../../Common/Enums/Region';
import SteamID from '../../../Common/Types/SteamID';
@Entity('announcements')
export default class Announcement {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@IsString()
	@IsNotEmpty()
	message: string;

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
}
