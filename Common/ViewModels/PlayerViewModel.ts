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
import ValidateClass from '../../Intel/src/utils/ValidateClass';

export default class PlayerViewModel {
	@IsString()
	alias: string;

	@IsNumberString()
	steamid: string;

	@IsString()
	avatarUrl: string;

	@IsDefined()
	@ValidateNested()
	settings: PlayerSettings;

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

		return ValidateClass(playerViewModel);
	}
}
