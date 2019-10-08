import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { IsNumberString, IsEnum, IsString, IsNotEmpty, IsDate, Validate } from 'class-validator';
import Player from './Player';
import MatchType from '../../../Common/Enums/MatchType';
import Team from '../../../Common/Enums/Team';
import MatchPlayerData from './MatchPlayerData';
import Region from '../../../Common/Enums/Region';
import Gamemode from '../../../Common/Enums/Gamemode';
import ProfileMatchViewModel from '../../../Common/ViewModels/ProfileMatchViewModel';
import Outcome from '../../../Common/Enums/Outcome';
import ValidateClass from '../utils/ValidateClass';

@Entity('matches')
export default class Match {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column()
	@IsEnum(MatchType)
	matchType: MatchType;

	@Column()
	@IsEnum(Gamemode)
	gamemode: Gamemode;

	@Column()
	@IsString()
	@IsNotEmpty()
	map: string;

	@Column()
	@IsEnum(Region)
	region: Region;

	@Column()
	@IsEnum(Team)
	winningTeam: Team;

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

	@OneToMany(type => MatchPlayerData, matchPlayerData => matchPlayerData.match, {
		cascade: true
	})
	matchPlayerData: MatchPlayerData[];

	static toProfileMatchViewModel(match: Match): ProfileMatchViewModel {
		const profileMatchViewModel = new ProfileMatchViewModel();

		profileMatchViewModel.id = match.id;
		profileMatchViewModel.date = match.date;
		profileMatchViewModel.logsId = match.logsId;
		profileMatchViewModel.map = match.map;
		profileMatchViewModel.matchType = match.matchType;
		profileMatchViewModel.wasCaptain = match.matchPlayerData[0].wasCaptain;

		if (match.winningTeam === match.matchPlayerData[0].team) {
			profileMatchViewModel.outcome = Outcome.WIN;
		} else if (match.winningTeam === Team.NONE) {
			profileMatchViewModel.outcome = Outcome.TIE;
		} else {
			profileMatchViewModel.outcome = Outcome.LOSS;
		}

		profileMatchViewModel.team = match.matchPlayerData[0].team;
		profileMatchViewModel.tf2class = match.matchPlayerData[0].tf2class;

		return ValidateClass(profileMatchViewModel);
	}
}
