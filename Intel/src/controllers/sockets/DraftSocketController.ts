import { Socket, Server } from 'socket.io';
import { SocketIO, SocketController, OnMessage, MessageBody, ConnectedSocket } from 'socket-controllers';
import DraftService from '../../services/DraftService';
import AddPlayerToDraftTFClassRequest from '../../../../Common/Requests/AddToDraftTFClassRequest';
import GetDraftTFClassListRequest from '../../../../Common/Requests/GetDraftTFClassListRequest';
import RemovePlayerFromDraftTFClassRequest from '../../../../Common/Requests/RemovePlayerFromDraftTFClassRequest';
import ValidateClass from '../../utils/ValidateClass';
import SteamID from '../../../../Common/Types/SteamID';
import DraftEvents from '../../events/DraftEvents';
import Logger from '../../modules/Logger';
import SocketWithPlayer from '../../interfaces/SocketWithPlayer';

@SocketController()
export default class DraftSocketController {
	private readonly draftEvents = new DraftEvents();
	private readonly draftService = new DraftService();

	@OnMessage('getDraftTFClassList')
	async getDraftTFClassList(@ConnectedSocket() socket: Socket, @MessageBody() payload: GetDraftTFClassListRequest) {
		Logger.logInfo(`Received request to get players added to ${payload.draftTFClass}`);
		ValidateClass(payload);
		const players: SteamID[] = this.draftService.getAllPlayersByDraftTFClass(payload.draftTFClass);
		socket.emit('draftTFClassList', payload.draftTFClass, players);
	}

	@OnMessage('addPlayerToDraftTFClass')
	addToDraftTFClass(
		@ConnectedSocket() socket: SocketWithPlayer,
		@MessageBody() payload: AddPlayerToDraftTFClassRequest
	) {
		Logger.logInfo(`Received request to add ${socket.request.session.player.alias} to ${payload.draftTFClass}`, {
			steamid: socket.request.session.player.steamid
		});
		ValidateClass(payload);
		const { steamid } = socket.request.session.player;
		this.draftEvents.addPlayerToDraftTFClass(steamid, payload.draftTFClass);
	}

	@OnMessage('removePlayerFromDraftTFClass')
	removePlayerFromDraftTFClass(
		@ConnectedSocket() socket: SocketWithPlayer,
		@MessageBody() payload: RemovePlayerFromDraftTFClassRequest
	) {
		Logger.logInfo(`Received request to remove ${socket.request.session.player.alias} to ${payload.draftTFClass}`, {
			steamid: socket.request.session.player.steamid
		});
		ValidateClass(payload);
		const { steamid } = socket.request.session.player;
		this.draftEvents.removePlayerFromDraftTFClass(steamid, payload.draftTFClass);
	}
}
