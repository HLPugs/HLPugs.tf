import { IsString, Matches, IsNumberString, IsArray, IsEnum } from 'class-validator';
import { ALIAS_REGEX_PATTERN } from '../Constants/AliasConstraints';
import SteamID from '../Types/SteamID';
import PermissionGroup from '../Enums/PermissionGroup';
import Role from '../Enums/Role';
import Player from '../../Intel/src/entities/Player';
import ValidateClass from '../../Intel/src/utils/ValidateClass';

export default class PlayerRoleViewModel {
	@IsString()
	@Matches(new RegExp(ALIAS_REGEX_PATTERN))
	alias: string;

	@IsNumberString()
	steamid: SteamID;

	@IsString()
	avatarUrl: string;

	@IsArray()
	roles: Role[];

	@IsEnum(PermissionGroup)
	permissionGroup: PermissionGroup;

	static fromPlayer(player: Player) {
		return ValidateClass<PlayerRoleViewModel>({
			alias: player.alias,
			steamid: player.steamid,
			avatarUrl: player.avatarUrl,
			permissionGroup: player.permissionGroup,
			roles: player.roles
		});
	}
}
