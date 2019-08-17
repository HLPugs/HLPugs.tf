//import PlayerSettings from '../../Intel/src/entities/PlayerSettings';
//import Player from '../../Intel/src/entities/Player';

export default class UserViewModel {
	loggedIn?: boolean;
	alias?: string;
	steamid?: string;
	avatarUrl?: string;
	settings: any;
	isBanned: boolean;

	static fromPlayer(player: any) {
		const userViewModel = new UserViewModel();

		userViewModel.alias = player.alias;
		userViewModel.avatarUrl = player.avatarUrl;
		userViewModel.settings = player.settings;
		userViewModel.steamid = player.steamid;

		return userViewModel;
	}
  }