import { Entity, Column, ManyToOne } from 'typeorm';
import MatchEntity from './MatchEntity';
import PlayerEntity from './PlayerEntity';
import Team from '../../../Common/Enums/Team';
import DraftTFClass from '../../../Common/Enums/DraftTFClass';

@Entity()
export default class MatchPlayerData {
	@Column()
	tf2class: DraftTFClass;

	@Column()
	team: Team;

	@Column({ default: false })
	wasCaptain: boolean;

	@ManyToOne(type => MatchEntity, match => match.matchPlayerData, { primary: true })
	match?: MatchEntity;

	@ManyToOne(type => PlayerEntity, player => player.matchPlayerData, {
		primary: true
	})
	player!: PlayerEntity;
}
