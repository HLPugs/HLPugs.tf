import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Allow, IsNumberString, IsEnum, IsString, IsNotEmpty, IsDate } from 'class-validator';
import { Team } from '../enums/Team';
import { LinqRepository } from 'typeorm-linq-repository';
import { MatchType } from '../enums/MatchType';

@Entity('matches')
export class Match {
	
	@PrimaryGeneratedColumn()
	@Allow()
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

export const pugRepository: LinqRepository<Match> = new LinqRepository(Match);