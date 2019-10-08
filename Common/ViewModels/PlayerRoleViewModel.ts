import { IsString, Matches, IsNumberString, IsArray, IsEnum } from 'class-validator';
import { ALIAS_REGEX_PATTERN } from '../Constants/AliasConstraints';
import SteamID from '../Types/SteamID';
import PermissionGroup from '../Enums/PermissionGroup';
import Role from '../Enums/Role';

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
}
