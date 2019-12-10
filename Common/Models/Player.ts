import {
	IsNumberString,
	IsOptional,
	IsString,
	Matches,
	IsEnum,
	ArrayUnique,
	IsInt,
	IsBoolean,
	ValidateNested
} from 'class-validator';

import SteamID from '../Types/SteamID';

import { ALIAS_REGEX_PATTERN } from '../Constants/AliasConstraints';

import PermissionGroup from '../Enums/PermissionGroup';

import Role from '../Enums/Role';

import ValidateClass from '../../Intel/src/utils/ValidateClass';

import PlayerViewModel from '../ViewModels/PlayerViewModel';

import PlayerService from '../../Intel/src/services/PlayerService';

import { ProfileViewModel } from '../ViewModels/ProfileViewModel';

import PlayerRoleViewModel from '../ViewModels/PlayerRoleViewModel';
import UnnamedPlayer from '../../Intel/src/interfaces/UnnamedPlayer';
import PlayerSettings from './PlayerSettings';

export default class Player implements UnnamedPlayer {
	@IsNumberString()
	steamid: SteamID;

	@IsOptional()
	@IsString()
	@Matches(new RegExp(ALIAS_REGEX_PATTERN))
	alias: string;

	@IsString()
	avatarUrl: string;

	@IsEnum(PermissionGroup)
	permissionGroup: PermissionGroup = PermissionGroup.NONE;

	@IsOptional()
@ArrayUnique()
	roles: Role[] = [];

	@IsString()
	ip: string;

	@IsInt()
	totalPugCount: number = 0;

	@IsInt()
	totalWinCount: number = 0;

	@IsInt()
	totalTieCount: number = 0;

	@IsInt()
	totalLossCount: number = 0;

	@IsBoolean()
	isCaptain: boolean = false;

	@IsInt()
	subsIn: number = 0;

	@IsInt()
	subsOut: number = 0;

	@IsBoolean()
	isCrestricted: boolean = false;

	@ValidateNested()
	settings: PlayerSettings;

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
