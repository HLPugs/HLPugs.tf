import { Socket, Server } from 'socket.io';
import { SocketIO, SocketController, OnMessage, MessageBody, ConnectedSocket } from 'socket-controllers';
import DraftService from '../../services/DraftService';
import AddToDraftTFClassListDTO from '../../../../Common/DTOs/AddToDraftClassListDTO';
import GetDraftTFClassListDTO from '../../../../Common/DTOs/GetDraftTFClassListDTO';
import RemovePlayerFromDraftTFClassDTO from '../../../../Common/DTOs/RemovePlayerFromDraftTFClassDTO';
import ValidateClass from '../../utils/ValidateClass';
import PlayerViewModel from '../../../../Common/ViewModels/PlayerViewModel';
import PlayerService from '../../services/PlayerService';

const draftService = new DraftService();
const playerService = new PlayerService();

@SocketController()
export default class DraftSocketController {
	@OnMessage('getDraftTFClassList')
	async getDraftTFClassList(@ConnectedSocket() socket: Socket, @MessageBody() body: GetDraftTFClassListDTO) {
		ValidateClass(body);
		const steamids = draftService.getAllPlayersByDraftTFClass(body.draftTFClass);
		socket.emit('draftTFClassList', body.draftTFClass, steamids);
	}

	@OnMessage('addPlayerToDraftTFClass')
	addToDraftTFClass(
		@ConnectedSocket() socket: Socket,
		@SocketIO() io: Server,
		@MessageBody() body: AddToDraftTFClassListDTO
	) {
		ValidateClass(body);
		const { steamid } = socket.request.session.player;
		draftService.addPlayerToDraftTFClass(steamid, body.draftTFClass);
		socket.emit('addPlayerToDraftTFClass', body.draftTFClass, steamid);
	}

	@OnMessage('removePlayerFromDraftTFClass')
	removePlayerFromDraftTFClass(
		@ConnectedSocket() socket: Socket,
		@SocketIO() io: Server,
		@MessageBody() body: RemovePlayerFromDraftTFClassDTO
	) {
		ValidateClass(body);
		const { steamid } = socket.request.session.player;
		draftService.removePlayerFromDraftTFClass(steamid, body.draftTFClass);
		io.emit('removePlayerFromDraftTFClass', body.draftTFClass, steamid);
	}
}
