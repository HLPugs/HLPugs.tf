import {
	SocketController,
	OnMessage,
	EmitOnSuccess,
	EmitOnFail,
	MessageBody,
	ConnectedSocket
} from 'socket-controllers';
import PlayerService from '../../services/PlayerService';
import { Socket } from 'socket.io';
import { PlayerSettingsViewModel } from '../../../../Common/ViewModels/PlayerSettingsViewModel';
import GetPlayerSettingsRequest from '../../../../Common/Requests/GetPlayerSettingsRequest';
import ValidateClass from '../../utils/ValidateClass';
import UpdatePlayerSettingsRequest from '../../../../Common/Requests/UpdatePlayerSettingsRequest';
import PlayerSettings from '../../entities/PlayerSettings';
import SocketWithPlayer from '../../interfaces/SocketWithPlayer';

@SocketController()
export default class SettingsSocketController {
	private readonly playerService = new PlayerService();

	@OnMessage('getPlayerSettings')
	async loadSettings(@ConnectedSocket() socket: Socket, @MessageBody() payload: GetPlayerSettingsRequest) {
		const { steamid } = ValidateClass(payload);
		const settings = await this.playerService.getSettings(steamid);
		const playerSettingsViewModel = PlayerSettingsViewModel.fromSettings(settings);
		socket.emit('getPlayerSettings', playerSettingsViewModel);
	}

	@OnMessage('saveSettings')
	@EmitOnSuccess('settingsSuccess')
	@EmitOnFail('settingsError')
	async saveSettings(@ConnectedSocket() socket: SocketWithPlayer, @MessageBody() payload: UpdatePlayerSettingsRequest) {
		const { playerSettingsViewModel } = payload;
		const { steamid } = socket.request.session.player;
		const settings = PlayerSettings.fromViewModel(playerSettingsViewModel);
		await this.playerService.updateSettings(steamid, settings);
		socket.request.session.player.settings = settings;
		socket.request.session.save();
	}
}
