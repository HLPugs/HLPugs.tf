import { Entity, Column, Index, OneToMany, PrimaryColumn, ManyToMany, OneToOne, JoinColumn } from 'typeorm';
import {
	Length,
	IsInt,
	IsBoolean,
	IsFQDN,
	IsOptional,
	IsString,
	IsIP,
	IsNumberString,
	Matches,
	Allow,
	IsEnum,
	ArrayUnique,
	ValidateNested
} from 'class-validator';
import Match from './Match';
import PermissionGroup from '../../../Common/Enums/PermissionGroup';
import Role from '../../../Common/Enums/Role';
import PlayerSettings from './PlayerSettings';
import MatchPlayerData from './MatchPlayerData';
import SteamID from '../../../Common/Types/SteamID';
import Punishment from './Punishment';
import { ALIAS_REGEX_PATTERN, MIN_ALIAS_LENGTH, MAX_ALIAS_LENGTH } from '../../../Common/Constants/AliasConstraints';
import PlayerViewModel from '../../../Common/ViewModels/PlayerViewModel';
import ValidateClass from '../utils/ValidateClass';
import PlayerService from '../services/PlayerService';
import PlayerRoleViewModel from '../../../Common/ViewModels/PlayerRoleViewModel';
import { ProfileViewModel } from '../../../Common/ViewModels/ProfileViewModel';

@Entity({ name: 'players' })
export default class Player {
	@Allow()
	id: number;

	@PrimaryColumn()
	@Index({ unique: true })
	@IsNumberString()
	steamid: string;

	@Column({ nullable: true })
	@IsOptional()
	@IsString()
	@Index({ unique: true })
	@Matches(new RegExp(ALIAS_REGEX_PATTERN))
	alias: string;

	@Column()
	@IsString()
	avatarUrl: string;

	@Column({ default: PermissionGroup.NONE })
	@IsEnum(PermissionGroup)
	permissionGroup: PermissionGroup = PermissionGroup.NONE;

	@Column('simple-array', { default: '' })
	@IsOptional()
	@ArrayUnique()
	roles: Role[] = [];

	@Column()
	@IsString()
	ip: string;

	@Column({ default: 0 })
	@IsInt()
	totalPugCount: number = 0;

	@Column({ default: 0 })
	@IsInt()
	totalWinCount: number = 0;

	@Column({ default: 0 })
	@IsInt()
	totalTieCount: number = 0;

	@Column({ default: 0 })
	@IsInt()
	totalLossCount: number = 0;

	@Column({ default: false })
	@IsBoolean()
	isCaptain: boolean = false;

	@Column({ default: 0 })
	@IsInt()
	subsIn: number = 0;

	@Column({ default: 0 })
	@IsInt()
	subsOut: number = 0;

	@Column({ default: false })
	@IsBoolean()
	isCrestricted: boolean = false;

	@OneToOne(type => PlayerSettings, settings => settings.player, {
		cascade: true
	})
	@ValidateNested()
	settings: PlayerSettings;

	@OneToMany(type => Punishment, punishment => punishment.offender)
	punishments: Punishment[];

	@OneToMany(type => Punishment, punishment => punishment.creator)
	createdPunishments: Punishment[];

	@ManyToMany(type => Match, match => match.players)
	matches: Match[];

	@OneToMany(type => MatchPlayerData, matchPlayerData => matchPlayerData.player)
	matchPlayerData: MatchPlayerData[];

	static async toPlayerViewModel(player: Player) {
		return ValidateClass<PlayerViewModel>({
			alias: player.alias,
			avatarUrl: player.avatarUrl,
			settings: player.settings,
			steamid: player.steamid,
			roles: player.roles,
			permissionGroup: player.permissionGroup,
			isMutedInChat: await new PlayerService().isCurrentlyMutedInChat(player.steamid)
		});
	}

	static toProfileViewModel(player: Player) {
		return ValidateClass<ProfileViewModel>({
			alias: player.alias,
			avatarUrl: player.avatarUrl,
			steamid: player.steamid,
			subsIn: player.subsIn,
			subsOut: player.subsOut
		});
	}

	static toPlayerRoleViewModel(player: Player) {
		return ValidateClass<PlayerRoleViewModel>({
			alias: player.alias,
			steamid: player.steamid,
			avatarUrl: player.avatarUrl,
			permissionGroup: player.permissionGroup,
			roles: player.roles
		});
	}
}
