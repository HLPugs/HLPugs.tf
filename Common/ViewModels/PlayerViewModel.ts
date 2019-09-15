import PlayerSettings from '../../Intel/src/entities/PlayerSettings';
import Player from '../../Intel/src/entities/Player';
import Role from '../Enums/Role';
import PermissionGroup from '../Enums/PermissionGroup';
import {
	IsString,
	ValidateNested,
	IsBoolean,
	IsOptional,
	IsNumberString,
	IsFQDN,
	IsDefined,
	IsEnum
} from 'class-validator';
import PlayerService from '../../Intel/src/services/PlayerService';

export default class PlayerViewModel {
	@IsBoolean()
	@IsDefined()
	isLoggedIn = false;

	@IsString()
	alias: string;

	@IsNumberString()
	steamid: string;

	@IsString()
	avatarUrl: string;

	@IsDefined()
	@ValidateNested()
	settings: PlayerSettings;

	@IsBoolean()
	@IsDefined()
	isBanned: boolean;

	@IsDefined()
	roles: Role[];

	@IsEnum(PermissionGroup)
	permissionGroup: PermissionGroup;

	static fromPlayer(player: Player) {
		const playerViewModel = new PlayerViewModel();

		playerViewModel.alias = player.alias;
		playerViewModel.avatarUrl = player.avatarUrl;
		playerViewModel.settings = player.settings;
		playerViewModel.steamid = player.steamid;
		playerViewModel.roles = player.roles;
		playerViewModel.permissionGroup = player.permissionGroup;

		return playerViewModel;
	}
}
