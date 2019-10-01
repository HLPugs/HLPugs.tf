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

@SocketController()
export default class SettingsSocketController {
	private readonly playerService = new PlayerService();

	@OnMessage('getPlayerSettings')
	async loadSettings(@ConnectedSocket() socket: Socket, @MessageBody() body: GetPlayerSettingsRequest) {
		const { steamid } = ValidateClass(body);
		const settings = await this.playerService.getSettings(steamid);
		const playerSettingsViewModel = PlayerSettingsViewModel.fromSettings(settings);
		socket.emit('getPlayerSettings', playerSettingsViewModel);
	}

	@OnMessage('saveSettings')
	@EmitOnSuccess('settingsSuccess')
	@EmitOnFail('settingsError')
	async saveSettings(@ConnectedSocket() socket: Socket, @MessageBody() body: UpdatePlayerSettingsRequest) {
		const { steamid, playerSettingsViewModel } = body;
		const settings = PlayerSettings.fromViewModel(playerSettingsViewModel);
		await this.playerService.updateSettings(steamid, settings);
	}
}
