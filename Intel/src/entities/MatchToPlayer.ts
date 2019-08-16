import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import Match from './Match';
import Player from './Player';
import Team from '../../../common/Enums/Team';

@Entity()
export default class MatchToPlayer {

	@PrimaryGeneratedColumn()
	matchToPlayerId!: number;

	matchId!: number;
	postId!: number;

	@Column()
	tf2class: Models.DraftTFClass;

	@Column()
	team: Team;

	@ManyToOne(type => Match, match => match.matchToPlayerCategories)
	match!: Match;

	@ManyToOne(type => Player, player => player.matchToPlayerCategories)
	player!: Player;
	
}