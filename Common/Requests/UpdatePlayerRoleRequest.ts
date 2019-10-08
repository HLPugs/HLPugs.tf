import Role from '../Enums/Role';
import PermissionGroup from '../Enums/PermissionGroup';
import { IsEnum, IsBoolean, IsDivisibleBy, IsEmail, IsFQDN } from 'class-validator';

export default class UpdatePlayerRoleRequest {
	@IsEnum(Role, { each: true })
	roles: Role[];

	@IsEnum(PermissionGroup)
	permissionGroup: PermissionGroup;
}
