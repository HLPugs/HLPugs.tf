import PermissionGroup from '../../../Common/Enums/PermissionGroup';
import Permission from '../../../Common/Enums/Permission';

export const Permissions: { [key in Exclude<PermissionGroup, PermissionGroup.NONE>]: Permission[] } = {
	// Moderators and up and access this (so basically, anyone with a permission group)
	[PermissionGroup.MODERATOR]: [Permission.MUTE_PLAYER, Permission.BAN_PLAYER],
	// Only Admins and above can execute these permissions
	[PermissionGroup.ADMIN]: [],
	// Only Head Admins can execute these permissions
	[PermissionGroup.HEAD_ADMIN]: []
};
