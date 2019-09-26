import {
	SocketController,
	OnMessage,
	EmitOnSuccess,
	EmitOnFail,
	MessageBody,
	ConnectedSocket
} from 'socket-controllers';
import { Socket } from 'socket.io';
import { playerService } from '../../services';

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
