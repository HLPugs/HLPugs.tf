import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsNumberString, IsString, MinDate, IsDate, Allow, IsEnum } from 'class-validator';
import PunishmentType from '@hlpugs/common/lib/Enums/PunishmentType';

@Entity()
export default class Punishment {
	
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@IsEnum(PunishmentType)
	punishmentType: PunishmentType;

	@Column()
	@IsNumberString()
	offenderSteamid: string;

	@Column()
	@IsNumberString()
	creatorSteamid: string;

	@Column()
	@IsString()
	reason: string;

	@Column()
	@IsDate()
	@MinDate(new Date())
	expirationDate: Date;

	@Column()
	@IsDate()
	createdDate: Date;

	@Column()
	@IsDate()
	lastModifiedDate: Date;

	isActive: boolean;
}