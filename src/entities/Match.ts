import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsNumberString, IsEnum, IsString, IsNotEmpty, IsDate, IsIn } from 'class-validator';
import { Team } from '../enums/Team';
import { LinqRepository } from 'typeorm-linq-repository';
import { MatchType } from '../enums/MatchType';

@Entity('matches')
export default class Match {
	
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@IsEnum(MatchType)
	matchType: MatchType;

	@Column()
	@IsString()
	@IsNotEmpty()
	map: String;

	@Column()
	@IsEnum(Team)
	winningTeam: Team;

	@Column()
	@IsDate()
	date: Date;

	@Column()
	@IsNumberString()
	logsId: number;
}