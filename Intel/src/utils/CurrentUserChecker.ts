import { Action } from 'routing-controllers';
import PlayerService from '../services/PlayerService';
import Player from '../entities/Player';

const playerService = new PlayerService();

const CurrentUserChecker = async (action: Action) => {
	const playerExists = await playerService.playerExists(
		action.request.user.steamid);
	const newIp =
		action.request.header('x-forwarded-for') ||
		action.request.connection.remoteAddress;
	const newAvatarUrl = action.request.user.avatar.large;

	if (playerExists) {
		const existingPlayer = await playerService.getPlayer(action.request.user.steamid);
		existingPlayer.ip = newIp;
		existingPlayer.avatarUrl = newAvatarUrl;
		return existingPlayer;
	} else {
		const player = new Player();
		player.steamid = action.request.user.steamid;
		player.ip = newIp;
		player.avatarUrl = newAvatarUrl;
		return player;
	}
};

export default CurrentUserChecker;
