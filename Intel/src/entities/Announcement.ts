import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Allow, IsEnum, IsString,IsNumberString, IsBoolean, IsDate, IsNotEmpty } from 'class-validator';
import { LinqRepository } from 'typeorm-linq-repository';
import { Region } from '../enums/Region';

@Entity('announcements')
export default class Announcement {
	
	@PrimaryGeneratedColumn()
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
	timestamp?: Date;
}