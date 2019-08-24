import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import Match from './Match';
import Player from './Player';
import Team from '../../../Common/Enums/Team';
import DraftTFClass from '../../../Common/Enums/DraftTFClass';

@Entity()
export default class MatchPlayerData {
	
	@Column()
	tf2class: DraftTFClass;

	@Column()
	team: Team;

	@ManyToOne(type => Match, match => match.matchPlayerData, { primary: true })
	match!: Match;

	@ManyToOne(type => Player, player => player.matchPlayerData, { primary: true })
	player!: Player;
}