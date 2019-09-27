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

@SocketController()
export default class SettingsSocketController {
	private readonly playerService = new PlayerService();

	@OnMessage('loadSettings')
	async loadSettings(@ConnectedSocket() socket: Socket, @MessageBody() body: any) {
		const { alias } = body;
		const settings = await this.playerService.getSettings(alias);
		socket.emit('playerSettings', settings);
	}

	@OnMessage('saveSettings')
	@EmitOnSuccess('settingsSuccess')
	@EmitOnFail('settingsError')
	async saveSettings(@ConnectedSocket() socket: Socket, @MessageBody() body: any) {
		const { alias, settings } = body;
		await this.playerService.updateSettings(alias, settings);
	}
}
