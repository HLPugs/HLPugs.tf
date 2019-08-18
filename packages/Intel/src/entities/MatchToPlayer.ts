import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import Match from './Match';
import Player from './Player';
import Team from '@hlpugs/common/lib/Enums/Team';
import DraftTFClass from '@hlpugs/common/lib/Models/DraftTFClass';

@Entity()
export default class MatchToPlayer {

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