import PlayerSettings from '../../Intel/src/entities/PlayerSettings';
import Player from '../../Intel/src/entities/Player';
import Role from '../Enums/Role';
import PermissionGroup from '../Enums/PermissionGroup';

export default class PlayerViewModel {
	isLoggedIn = false;
	alias?: string;
	steamid?: string;
	avatarUrl?: string;
	settings!: PlayerSettings;
	isBanned!: boolean;
	roles: Role[];
	permissionGroup?: PermissionGroup;

	static fromPlayer(player: Player) {
		const playerViewModel = new PlayerViewModel();

		playerViewModel.alias = player.alias;
		playerViewModel.avatarUrl = player.avatarUrl;
		playerViewModel.settings = player.settings;
		playerViewModel.steamid = player.steamid;
		playerViewModel.roles = player.roles;
		playerViewModel.permissionGroup = player.permissionGroup;

		return playerViewModel;
	}
}
