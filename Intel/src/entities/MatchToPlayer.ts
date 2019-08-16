import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import Match from './Match';
import Player from './Player';
import { DraftTFClass } from '../structures/DraftClassList';
import Team from '../../../Common/Enums/Team';

@Entity()
export class MatchToPlayer {

	@PrimaryGeneratedColumn()
	matchToPlayerId!: number;

	matchId!: number;
	postId!: number;

	@Column()
	tf2class: DraftTFClass;

	@Column()
	team: Team;

	@ManyToOne(type => Match, match => match.matchToPlayerCategories)
	match!: Match;

	@ManyToOne(type => Player, player => player.matchToPlayerCategories)
	player!: Player;
	
}