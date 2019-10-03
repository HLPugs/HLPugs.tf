import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { IsNumberString, IsString, MinDate, IsDate, IsEnum } from 'class-validator';
import PunishmentType from '../../../Common/Enums/PunishmentType';
import SteamID from '../../../Common/Types/SteamID';
import Player from './Player';

@Entity('punishments')
export default class Punishment {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@IsEnum(PunishmentType)
	punishmentType: PunishmentType;

	@ManyToOne(type => Player, player => player.punishments)
	offender: Player;

	@IsNumberString()
	@ManyToOne(type => Player, player => player.createdPunishments)
	creator: Player;

	@Column()
	@IsString()
	reason: string;

	@Column()
	@IsDate()
	@MinDate(new Date())
	expirationDate: Date;

	@Column()
	@IsDate()
	creationDate: Date;

	@Column()
	@IsDate()
	lastModifiedDate: Date;
}
