import { SocketController, OnMessage, EmitOnSuccess, EmitOnFail, MessageBody, ConnectedSocket } from 'socket-controllers';
import PlayerSettings from '../../entities/PlayerSettings';
import PlayerService from '../../services/PlayerService';
import { Socket } from 'socket.io';

const playerService = new PlayerService();

@SocketController()
export default class SettingsSocketController {
	
	@OnMessage('loadSettings')
	async loadSettings(@ConnectedSocket() socket: Socket, @MessageBody() body: any) {
		const { alias } = body;
		const settings = await playerService.getSettings(alias);
		socket.emit('playerSettings', settings);
	}

	@OnMessage('saveSettings')
	@EmitOnSuccess('settingsSuccess')
	@EmitOnFail('settingsError')
	async saveSettings(@ConnectedSocket() socket: Socket, @MessageBody() body: any) {
		const { alias, settings } = body;
		await playerService.updateSettings(alias, settings);
	}
}