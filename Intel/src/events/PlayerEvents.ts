import PlayerSettings from '../entities/PlayerSettings';
import SteamID from '../../../Common/Types/SteamID';
import PlayerService from '../services/PlayerService';
import SocketWithPlayer from '../interfaces/SocketWithPlayer';

export default class PlayerEvents {
	private readonly playerService = new PlayerService();

	async updateSettings(socket: SocketWithPlayer, steamid: SteamID, settings: PlayerSettings) {
		await this.playerService.updateSettings(steamid, settings);
		socket.request.session.player.settings = settings;
		socket.request.session.save();
	}
}
