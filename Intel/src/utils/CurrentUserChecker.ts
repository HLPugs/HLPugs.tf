import { Action } from 'routing-controllers';
import PlayerService from '../services/PlayerService';
import ValidateClass from './ValidateClass';
import UnnamedPlayer from '../interfaces/UnnamedPlayer';
import Player from '../../../Common/Models/Player';

const playerService = new PlayerService();

const CurrentUserChecker = async (action: Action): Promise<Player | UnnamedPlayer> => {
	const newIp = action.request.header('x-forwarded-for') || action.request.connection.remoteAddress;
	const newAvatarUrl = action.request.user.avatar.large;

	if (action.request.session.player) {
		const { player } = action.request.session;
		player.ip = newIp;
		player.avatarUrl = newAvatarUrl;
		return player;
	}

	const playerExists = await playerService.playerExists(action.request.user.steamid);

	if (playerExists) {
		const existingPlayer = await playerService.getPlayer(action.request.user.steamid);
		existingPlayer.ip = newIp;
		existingPlayer.avatarUrl = newAvatarUrl;
		return ValidateClass(existingPlayer);
	} else {
		const player = { steamid: action.request.user.steamid, ip: newIp, avatarUrl: newAvatarUrl } as UnnamedPlayer;
		return player;
	}
};

export default CurrentUserChecker;
