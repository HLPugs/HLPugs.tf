import {
	SocketController,
	OnMessage,
	EmitOnSuccess,
	EmitOnFail,
	MessageBody,
	ConnectedSocket,
	SocketRequest
} from 'socket-controllers';
import PlayerService from '../../services/PlayerService';
import { Socket } from 'socket.io';
import { PlayerSettingsViewModel } from '../../../../Common/ViewModels/PlayerSettingsViewModel';
import ValidateClass from '../../utils/ValidateClass';
import UpdatePlayerSettingsRequest from '../../../../Common/Requests/UpdatePlayerSettingsRequest';
import SocketWithPlayer from '../../interfaces/SocketWithPlayer';
import PlayerEvents from '../../events/PlayerEvents';
import Logger from '../../modules/Logger';
import SocketRequestWithPlayer from '../../interfaces/SocketRequestWithPlayer';
import PlayerSettings from '../../../../Common/Models/PlayerSettings';

@SocketController()
export default class SettingsSocketController {
	private readonly playerEvents = new PlayerEvents();
	private readonly playerService = new PlayerService();

	@OnMessage('getPlayerSettings')
	async loadSettings(@SocketRequest() request: SocketRequestWithPlayer) {
		Logger.logInfo("Received request to get a player's settings");
		await this.playerEvents.sendPlayerSettings(request.session.player.steamid);
	}

	@OnMessage('saveSettings')
	@EmitOnFail('settingsError')
	async saveSettings(@ConnectedSocket() socket: SocketWithPlayer, @MessageBody() payload: UpdatePlayerSettingsRequest) {
		Logger.logInfo("Received request to update a player's settings", payload.playerSettingsViewModel);
		const { playerSettingsViewModel } = ValidateClass(payload);
		const { steamid } = socket.request.session.player;
		const settings = PlayerSettings.fromViewModel(playerSettingsViewModel);
		await this.playerEvents.updateSettings(socket, steamid, settings);
	}
}
