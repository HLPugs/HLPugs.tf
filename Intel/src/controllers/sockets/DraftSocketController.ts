import { Socket, Server } from 'socket.io';
import { SocketIO, SocketController, OnMessage, MessageBody, ConnectedSocket } from 'socket-controllers';
import DraftService from '../../services/DraftService';
import AddPlayerToDraftTFClassRequest from '../../../../Common/Requests/AddToDraftTFClassRequest';
import GetDraftTFClassListRequest from '../../../../Common/Requests/GetDraftTFClassListRequest';
import RemovePlayerFromDraftTFClassRequest from '../../../../Common/Requests/RemovePlayerFromDraftTFClassRequest';
import ValidateClass from '../../utils/ValidateClass';
import SteamID from '../../../../Common/Types/SteamID';
import DraftEvents from '../../events/DraftEvents';

@SocketController()
export default class DraftSocketController {
	private readonly draftEvents = new DraftEvents();
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
		this.draftEvents.addPlayerToDraftTFClass(io, { steamid, draftTFClass: payload.draftTFClass });
	}

	@OnMessage('removePlayerFromDraftTFClass')
	removePlayerFromDraftTFClass(
		@ConnectedSocket() socket: Socket,
		@SocketIO() io: Server,
		@MessageBody() payload: RemovePlayerFromDraftTFClassRequest
	) {
		ValidateClass(payload);
		const { steamid } = socket.request.session.player;
		this.draftEvents.removePlayerFromDraftTFClass(io, { steamid, draftTFClass: payload.draftTFClass });
	}
}
