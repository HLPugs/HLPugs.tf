import PermissionGroupName from '@hlpugs/common/lib/Enums/PermissionGroup';
import Permission from '@hlpugs/common/lib/Enums/Permission';

export const ANY_PERMISSION_GROUP = 'ANY_PERMISSION_GROUP'

export const PermissionMap: Map<PermissionGroupName | string, Permission[]> = new Map([
	[
		// Anyone with a permission group can execute these permissions
		ANY_PERMISSION_GROUP,
		[Permission.MUTE_PLAYER, Permission.BAN_PLAYER],
	],
	[
		// Only Head Admins (and above?) can execute these permissions
		PermissionGroupName.HEAD_ADMIN,
		[]
	],
	[
		// Only Admins and above can execute these permissions
		PermissionGroupName.ADMIN,
		[]
	],
]);
