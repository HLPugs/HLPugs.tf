import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsNumberString, IsString, MinDate, IsDate, Allow, IsEnum } from 'class-validator';
import { PunishmentType } from '../enums/PunishmentType';
import { LinqRepository } from 'typeorm-linq-repository';

@Entity()
export class Punishment {
	
	@PrimaryGeneratedColumn()
	@Allow()
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
	expiration: Date;

	@Column()
	@IsDate()
	createdDate: Date;

	@Column()
	@IsDate()
	lastModifiedDate: Date;
}

export const punishmentRepository: LinqRepository<Punishment> = new LinqRepository(Punishment);