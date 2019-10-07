import Role from '../Enums/Role';
import PermissionGroup from '../Enums/PermissionGroup';

export default class UpdatePlayerRoleRequest {
	roles: Role[];
	permissionGroup: PermissionGroup;
}
