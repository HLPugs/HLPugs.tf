import { Entity, Column, Index, OneToMany, PrimaryColumn, ManyToMany, OneToOne } from 'typeorm';
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
	ArrayUnique
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
	@IsFQDN()
	avatarUrl: string;

	@Column({ nullable: true })
	@IsOptional()
	@IsEnum(PermissionGroup)
	permissionGroup: PermissionGroup;

	@Column('simple-array', { nullable: true })
	@IsOptional()
	@ArrayUnique()
	roles: Role[];

	@Column()
	@IsIP(4)
	ip: string;

	@Column({ default: 0 })
	@IsInt()
	totalPugCount: number;

	@Column({ default: 0 })
	@IsInt()
	totalWinCount: number;

	@Column({ default: 0 })
	@IsInt()
	totalTieCount: number;

	@Column({ default: 0 })
	@IsInt()
	totalLossCount: number;

	@Column({ default: false })
	@IsBoolean()
	isCaptain: boolean;

	@Column({ default: 0 })
	@IsInt()
	subsIn: number;

	@Column({ default: 0 })
	@IsInt()
	subsOut: number;

	@Column({ default: false })
	@IsBoolean()
	isCrestricted: boolean;

	@OneToOne(type => PlayerSettings, settings => settings.player, {
		cascade: true
	})
	settings: PlayerSettings;

	@ManyToMany(type => Match, match => match.players)
	matches: Match[];

	@OneToMany(type => MatchPlayerData, matchPlayerData => matchPlayerData.player)
	matchPlayerData: MatchPlayerData[];
}
