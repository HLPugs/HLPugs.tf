import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsNumberString, IsString, MinDate, IsDate, IsEnum } from 'class-validator';
import PunishmentType from '../../../Common/Enums/PunishmentType';
import SteamID from '../../../Common/Types/SteamID';

@Entity()
export default class Punishment {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@IsEnum(PunishmentType)
	punishmentType: PunishmentType;

	@Column()
	@IsNumberString()
	offenderSteamid: SteamID;

	@Column()
	@IsNumberString()
	creatorSteamid: SteamID;

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
