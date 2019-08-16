import PermissionGroupName from '../../../Common/Enums/PermissionGroup';

const PrivilegeRankings: Map<PermissionGroupName, number> = new Map(
	[
		[PermissionGroupName.HEAD_ADMIN, 30],
		[PermissionGroupName.ADMIN, 20],
		[PermissionGroupName.MODERATOR, 10]
	],
)

export default PrivilegeRankings;