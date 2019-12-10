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
import PlayerSettings from '../Models/PlayerSettings';

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

	@IsBoolean()
	isMutedInChat: boolean;
}
