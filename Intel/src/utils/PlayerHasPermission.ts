import Permission from '../../../Common/Enums/Permission';
import PermissionGroup from '../../../Common/Enums/PermissionGroup';
import { Permissions } from '../constants/Permissions';
import PrivilegeRankings from '../constants/PrivilegeRankings';
import Player from '../../../Common/Models/Player';

const PlayerHasPermission = (permission: Permission, player: Player): boolean => {
	for (const permissionGroup in Permissions) {
		if (Permissions[permissionGroup as Exclude<PermissionGroup, PermissionGroup.NONE>].includes(permission)) {
			const requiredPrivilegeRanking = PrivilegeRankings[permissionGroup as PermissionGroup];
			const playerPrivilegeRanking = PrivilegeRankings[player.permissionGroup];
			const playerHasPermission = playerPrivilegeRanking >= requiredPrivilegeRanking;
			if (playerHasPermission) {
				return true;
			} else {
				return false;
				const requiredPermissionGroup = permissionGroup as PermissionGroup;
				// TODO: Log`${player.alias} (${player.steamid}) tried executing ${permission} but does not have access because their permission group is ${player.permissionGroup} but the required permission group is ${requiredPermissionGroup} or higher`
			}
		}
	}
};

export default PlayerHasPermission;
