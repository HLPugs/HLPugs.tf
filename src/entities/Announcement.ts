import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Allow, IsEnum, IsString,IsNumberString, IsBoolean, IsDate, IsNotEmpty } from 'class-validator';
import { Region } from '../enums/Region';
import { LinqRepository } from 'typeorm-linq-repository';

@Entity('announcements')
export class Announcement {
	
	@PrimaryGeneratedColumn()
	@Allow()
	id: number

	@Column()
	@IsString()
	@IsNotEmpty()
	message: string;

	@Column()
	@IsEnum(Region)
	region: Region;

	@Column()
	@IsNumberString()
	creatorSteamid: string;

	@Column({ default: false })
	@IsBoolean()
	priority: boolean;

	@Column()
	@IsDate()
	timestamp: Date;
}

export const announcementRepository: LinqRepository<Announcement> = new LinqRepository(Announcement);