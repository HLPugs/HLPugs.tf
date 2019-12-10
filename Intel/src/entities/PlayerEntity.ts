import {
	Entity,
	Column,
	Index,
	OneToMany,
	PrimaryColumn,
	ManyToMany,
	OneToOne,
	JoinColumn,
	PrimaryGeneratedColumn
} from 'typeorm';
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
import MatchEntity from './MatchEntity';
import PermissionGroup from '../../../Common/Enums/PermissionGroup';
import Role from '../../../Common/Enums/Role';
import PlayerSettingsEntity from './PlayerSettingsEntity';
import MatchPlayerDataEntity from './MatchPlayerData';
import SteamID from '../../../Common/Types/SteamID';
import PunishmentEntity from './PunishmentEntity';
import { ALIAS_REGEX_PATTERN, MIN_ALIAS_LENGTH, MAX_ALIAS_LENGTH } from '../../../Common/Constants/AliasConstraints';
import PlayerViewModel from '../../../Common/ViewModels/PlayerViewModel';
import ValidateClass from '../utils/ValidateClass';
import PlayerService from '../services/PlayerService';
import PlayerRoleViewModel from '../../../Common/ViewModels/PlayerRoleViewModel';
import { ProfileViewModel } from '../../../Common/ViewModels/ProfileViewModel';
import Player from '../../../Common/Models/Player';
import UnnamedPlayer from '../interfaces/UnnamedPlayer';
import { LinqRepository } from 'typeorm-linq-repository';

@Entity({ name: 'players' })
export default class PlayerEntity {
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

	@OneToOne(type => PlayerSettingsEntity, settings => settings.player, {
		cascade: true
	})
	@ValidateNested()
	settings: PlayerSettingsEntity;

	@OneToMany(type => PunishmentEntity, punishment => punishment.offender)
	punishments: PunishmentEntity[];

	@OneToMany(type => PunishmentEntity, punishment => punishment.author)
	createdPunishments: PunishmentEntity[];

	@ManyToMany(type => MatchEntity, match => match.players)
	matches: MatchEntity[];

	@OneToMany(type => MatchPlayerDataEntity, matchPlayerData => matchPlayerData.player)
	matchPlayerData: MatchPlayerDataEntity[];

	static createNewPlayer(player: UnnamedPlayer) {
		return ValidateClass<PlayerEntity>({
			id: 0,
			alias: '',
			steamid: player.steamid,
			avatarUrl: player.avatarUrl,
			ip: player.ip,
			isCaptain: false,
			isCrestricted: false,
			createdPunishments: [],
			matchPlayerData: [],
			matches: [],
			punishments: [],
			roles: [],
			permissionGroup: PermissionGroup.NONE,
			settings: new PlayerSettingsEntity(),
			subsIn: 0,
			subsOut: 0,
			totalLossCount: 0,
			totalPugCount: 0,
			totalTieCount: 0,
			totalWinCount: 0
		});
	}

	static toPlayer(player: PlayerEntity) {
		return ValidateClass<Player>({
			alias: player.alias,
			avatarUrl: player.avatarUrl,
			ip: player.ip,
			isCaptain: player.isCaptain,
			isCrestricted: player.isCrestricted,
			permissionGroup: player.permissionGroup,
			roles: player.roles,
			settings: player.settings,
			steamid: player.steamid,
			subsIn: player.subsIn,
			subsOut: player.subsOut,
			totalLossCount: player.totalLossCount,
			totalPugCount: player.totalPugCount,
			totalTieCount: player.totalTieCount,
			totalWinCount: player.totalWinCount
		});
	}

	static async getBySteamID(steamid: SteamID) {
		const playerRepository = new LinqRepository(PlayerEntity);

		const playerEntity = playerRepository
			.getOne()
			.where(x => x.steamid)
			.equal(steamid);

		return ValidateClass(playerEntity);
	}
}
