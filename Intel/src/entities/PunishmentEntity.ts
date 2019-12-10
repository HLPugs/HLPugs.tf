import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { IsNumberString, IsString, MinDate, IsDate, IsEnum } from 'class-validator';
import PunishmentType from '../../../Common/Enums/PunishmentType';
import SteamID from '../../../Common/Types/SteamID';
import PlayerEntity from './PlayerEntity';
import BannedPageViewModel from '../../../Common/ViewModels/BannedPageViewModel';
import ValidateClass from '../utils/ValidateClass';
import Punishment from '../../../Common/Models/Punishment';
import PlayerService from '../services/PlayerService';

@Entity('punishments')
export default class PunishmentEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@IsEnum(PunishmentType)
	punishmentType: PunishmentType;

	@ManyToOne(type => PlayerEntity, player => player.punishments)
	offender: PlayerEntity;

	@ManyToOne(type => PlayerEntity, player => player.createdPunishments)
	author: PlayerEntity;

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

	static toPunishment(punishment: PunishmentEntity) {
		return ValidateClass<Punishment>({
			creationDate: punishment.creationDate,
			authorSteamID: punishment.author.steamid,
			expirationDate: punishment.expirationDate,
			reason: punishment.reason,
			lastModifiedDate: punishment.lastModifiedDate,
			offenderSteamID: punishment.offender.steamid,
			punishmentType: punishment.punishmentType
		});
	}

	static async fromPunishment(punishment: Punishment): Promise<PunishmentEntity> {
		return ValidateClass<PunishmentEntity>({
			id: 0,
			creationDate: punishment.creationDate,
			expirationDate: punishment.expirationDate,
			lastModifiedDate: punishment.lastModifiedDate,
			reason: punishment.reason,
			punishmentType: punishment.punishmentType,
			offender: await PlayerEntity.getBySteamID(punishment.offenderSteamID),
			author: await PlayerEntity.getBySteamID(punishment.authorSteamID)
		});
	}
}
