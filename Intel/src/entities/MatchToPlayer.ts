import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import Match from './Match';
import Player from './Player';
//import Team from '../../../common/Enums/Team';
//import DraftTFClass from '../../../common/Models/DraftTFClass';

@Entity()
export default class MatchToPlayer {

	@PrimaryGeneratedColumn()
	matchToPlayerId!: number;

	matchId!: number;
	postId!: number;

	@Column()
	tf2class: any;

	@Column()
	team: any;

	@ManyToOne(type => Match, match => match.matchToPlayerCategories)
	match!: Match;

	@ManyToOne(type => Player, player => player.matchToPlayerCategories)
	player!: Player;
	
}