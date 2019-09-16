import PermissionGroup from '../../../Common/Enums/PermissionGroup';

const PrivilegeRankings: { [key in PermissionGroup]: number } = {
	[PermissionGroup.HEAD_ADMIN]: 30,
	[PermissionGroup.ADMIN]: 20,
	[PermissionGroup.MODERATOR]: 10,
	[PermissionGroup.NONE]: 0
};

export default PrivilegeRankings;
