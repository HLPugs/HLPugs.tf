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

@Entity({ name: 'players' })
export default class Player {
	@Allow()
	id: number;

	@PrimaryColumn()
	@Index({ unique: true })
	@IsNumberString()
	steamid: SteamID;

	@Column({ nullable: true })
	@IsOptional()
	@IsString()
	@Index({ unique: true })
	@Matches(/^[a-zA-Z0-9_]{2,17}$/)
	@Length(2, 17)
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

	@ManyToMany(type => Match, match => match.players)
	matches: Match[];

	@OneToMany(type => MatchPlayerData, matchPlayerData => matchPlayerData.player)
	matchPlayerData: MatchPlayerData[];
}
