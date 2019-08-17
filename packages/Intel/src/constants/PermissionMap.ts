//import PermissionGroupName from '../../../Common/Enums/PermissionGroup';
//import Permission from '../../../Common/Enums/Permission';


export const ANY_PERMISSION_GROUP = 'ANY_PERMISSION_GROUP'

export const PermissionMap: Map<any | string, any[]> = new Map([
	[
		// Anyone with a permission group can execute these permissions
		ANY_PERMISSION_GROUP,
//		[Permission.MUTE_PLAYER, Permission.BAN_PLAYER],
		[]
	],
	[
		// Only Head Admins (and above?) can execute these permissions
//		PermissionGroupName.HEAD_ADMIN,
		'',
		[]
	],
	[
		// Only Admins and above can execute these permissions
		//PermissionGroupName.ADMIN,
		'',
		[]
	],
]);
