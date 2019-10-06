import Role from '../Enums/Role';
import PermissionGroup from '../Enums/PermissionGroup';

export default class UpdatePlayerRoleRequest {
	role: Role[];
	permissionGroup: PermissionGroup;
}
