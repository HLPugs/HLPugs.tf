import { Socket, Server } from 'socket.io';
import { SocketIO, SocketController, OnMessage, MessageBody, ConnectedSocket } from 'socket-controllers';
import DraftService from '../../services/DraftService';
import AddPlayerToDraftTFClassRequest from '../../../../Common/Requests/AddToDraftTFClassRequest';
import GetDraftTFClassListRequest from '../../../../Common/Requests/GetDraftTFClassListRequest';
import RemovePlayerFromDraftTFClassRequest from '../../../../Common/Requests/RemovePlayerFromDraftTFClassRequest';
import ValidateClass from '../../utils/ValidateClass';
import SteamID from '../../../../Common/Types/SteamID';

@SocketController()
export default class DraftSocketController {
	private readonly draftService = new DraftService();

	@OnMessage('getDraftTFClassList')
	async getDraftTFClassList(@ConnectedSocket() socket: Socket, @MessageBody() payload: GetDraftTFClassListRequest) {
		ValidateClass(payload);
		const players: SteamID[] = this.draftService.getAllPlayersByDraftTFClass(payload.draftTFClass);
		socket.emit('draftTFClassList', payload.draftTFClass, players);
	}

	@OnMessage('addPlayerToDraftTFClass')
	addToDraftTFClass(
		@ConnectedSocket() socket: Socket,
		@SocketIO() io: Server,
		@MessageBody() payload: AddPlayerToDraftTFClassRequest
	) {
		ValidateClass(payload);
		const { steamid } = socket.request.session.player;
		if (!this.draftService.isPlayerAddedToDraftTFClass(steamid, payload.draftTFClass)) {
			this.draftService.addPlayerToDraftTFClass(steamid, payload.draftTFClass);
			io.emit('addPlayerToDraftTFClass', payload.draftTFClass, steamid);
		}
	}

	@OnMessage('removePlayerFromDraftTFClass')
	removePlayerFromDraftTFClass(
		@ConnectedSocket() socket: Socket,
		@SocketIO() io: Server,
		@MessageBody() payload: RemovePlayerFromDraftTFClassRequest
	) {
		ValidateClass(payload);
		const { steamid } = socket.request.session.player;
		this.draftService.removePlayerFromDraftTFClass(steamid, payload.draftTFClass);
		io.emit('removePlayerFromDraftTFClass', payload.draftTFClass, steamid);
	}
}
