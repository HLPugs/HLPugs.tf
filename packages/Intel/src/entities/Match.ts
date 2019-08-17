import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { IsNumberString, IsEnum, IsString, IsNotEmpty, IsDate } from 'class-validator';
import Player from './Player';
//import MatchType from '../../../Common/Enums/MatchType';
//import Team from '../../../Common/Enums/Team';
import MatchToPlayer from './MatchToPlayer';

@Entity('matches')
export default class Match {
	
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@IsEnum('')
	matchType: string;

	@Column()
	@IsString()
	@IsNotEmpty()
	map: String;

	@Column()
	@IsEnum('')
	winningTeam: string;

	@CreateDateColumn()
	@IsDate()
	date: Date;

	@Column({ nullable: true })
	@IsNumberString()
	logsId: number;

	@ManyToMany(type => Player, player => player.matches)
	@JoinTable({ 
		name: 'match_players',
		joinColumn: {
			name: 'id',
			referencedColumnName: 'id'
		},
		inverseJoinColumn: {
			name: 'playerSteamid',
			referencedColumnName: 'steamid'
		}
	})
	players: Player[];

	matchToPlayerCategories: MatchToPlayer[];
}