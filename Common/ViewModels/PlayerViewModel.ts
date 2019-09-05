import PlayerSettings from '../../Intel/src/entities/PlayerSettings';
import Player from '../../Intel/src/entities/Player';

export default class PlayerViewModel {
	isLoggedIn: boolean = false;
	alias?: string
	steamid?: string;
	avatarUrl?: string;
	settings!: PlayerSettings;
	isBanned!: boolean;

	static fromPlayer(player: Player) {
		const playerViewModel = new PlayerViewModel();

		playerViewModel.alias = player.alias;
		playerViewModel.avatarUrl = player.avatarUrl;
		playerViewModel.settings = player.settings;
		playerViewModel.steamid = player.steamid;

		return playerViewModel;
	}
}
