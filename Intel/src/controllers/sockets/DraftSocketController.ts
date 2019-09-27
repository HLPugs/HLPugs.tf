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
	async getDraftTFClassList(@ConnectedSocket() socket: Socket, @MessageBody() body: GetDraftTFClassListRequest) {
		ValidateClass(body);
		const players: SteamID[] = this.draftService.getAllPlayersByDraftTFClass(body.draftTFClass);
		socket.emit('draftTFClassList', body.draftTFClass, players);
	}

	@OnMessage('addPlayerToDraftTFClass')
	addToDraftTFClass(
		@ConnectedSocket() socket: Socket,
		@SocketIO() io: Server,
		@MessageBody() body: AddPlayerToDraftTFClassRequest
	) {
		ValidateClass(body);
		const { steamid } = socket.request.session.player;
		if (!this.draftService.isPlayerAddedToDraftTFClass(steamid, body.draftTFClass)) {
			this.draftService.addPlayerToDraftTFClass(steamid, body.draftTFClass);
			io.emit('addPlayerToDraftTFClass', body.draftTFClass, steamid);
		}
	}

	@OnMessage('removePlayerFromDraftTFClass')
	removePlayerFromDraftTFClass(
		@ConnectedSocket() socket: Socket,
		@SocketIO() io: Server,
		@MessageBody() body: RemovePlayerFromDraftTFClassRequest
	) {
		ValidateClass(body);
		const { steamid } = socket.request.session.player;
		this.draftService.removePlayerFromDraftTFClass(steamid, body.draftTFClass);
		io.emit('removePlayerFromDraftTFClass', body.draftTFClass, steamid);
	}
}
