import { Socket, Server } from 'socket.io';
import { SocketIO, SocketController, OnMessage, MessageBody, ConnectedSocket } from 'socket-controllers';
import DraftService from '../../services/DraftService';
import AddToDraftTFClassListDTO from '../../../../Common/DTOs/AddToDraftClassListDTO';
import GetDraftTFClassListDTO from '../../../../Common/DTOs/GetDraftTFClassListDTO';
import RemovePlayerFromDraftTFClassDTO from '../../../../Common/DTOs/RemovePlayerFromDraftTFClassDTO';
import ValidateClass from '../../utils/ValidateClass';
import PlayerService from '../../services/PlayerService';
import SteamID from '../../../../Common/Types/SteamID';

@SocketController()
export default class DraftSocketController {
	private readonly draftService = new DraftService();

	@OnMessage('getDraftTFClassList')
	async getDraftTFClassList(@ConnectedSocket() socket: Socket, @MessageBody() body: GetDraftTFClassListDTO) {
		ValidateClass(body);
		const players: SteamID[] = this.draftService.getAllPlayersByDraftTFClass(body.draftTFClass);
		socket.emit('draftTFClassList', body.draftTFClass, players);
	}

	@OnMessage('addPlayerToDraftTFClass')
	addToDraftTFClass(
		@ConnectedSocket() socket: Socket,
		@SocketIO() io: Server,
		@MessageBody() body: AddToDraftTFClassListDTO
	) {
		ValidateClass(body);
		const { steamid } = socket.request.session.player;
		this.draftService.addPlayerToDraftTFClass(steamid, body.draftTFClass);
		io.emit('addPlayerToDraftTFClass', body.draftTFClass, steamid);
	}

	@OnMessage('removePlayerFromDraftTFClass')
	removePlayerFromDraftTFClass(
		@ConnectedSocket() socket: Socket,
		@SocketIO() io: Server,
		@MessageBody() body: RemovePlayerFromDraftTFClassDTO
	) {
		ValidateClass(body);
		const { steamid } = socket.request.session.player;
		this.draftService.removePlayerFromDraftTFClass(steamid, body.draftTFClass);
		io.emit('removePlayerFromDraftTFClass', body.draftTFClass, steamid);
	}
}
