import PermissionGroup from '../../../Common/Enums/PermissionGroup';

const PrivilegeRankings: Map<PermissionGroup, number> = new Map([
	[PermissionGroup.HEAD_ADMIN, 30],
	[PermissionGroup.ADMIN, 20],
	[PermissionGroup.MODERATOR, 10]
]);

export default PrivilegeRankings;
