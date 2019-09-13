import PermissionGroup from '../../../Common/Enums/PermissionGroup';
import Permission from '../../../Common/Enums/Permission';

export const ANY_PERMISSION_GROUP = 'ANY_PERMISSION_GROUP';

export const PermissionMap: Map<PermissionGroup | string, Permission[]> = new Map([
	[
		// Anyone with a permission group can execute these permissions
		ANY_PERMISSION_GROUP,
		[Permission.MUTE_PLAYER, Permission.BAN_PLAYER]
	],
	[
		// Only Head Admins (and above?) can execute these permissions
		PermissionGroup.HEAD_ADMIN,
		[]
	],
	[
		// Only Admins and above can execute these permissions
		PermissionGroup.ADMIN,
		[]
	]
]);
