import { Server, Socket } from 'socket.io';
import { SocketIO, SocketController, OnMessage, MessageBody, SocketRequest, ConnectedSocket } from 'socket-controllers';
import ChatService from '../../services/ChatService';
import SendMessageRequest from '../../../../Common/Requests/SendMessageRequest';
import Message from '../../../../Common/Models/Message';
import SocketRequestWithPlayer from '../../interfaces/SocketRequestWithPlayer';
import ValidateClass from '../../utils/ValidateClass';
import uuid = require('uuid');
import PlayerService from '../../services/PlayerService';
import ChatEvents from '../../events/ChatEvents';
import Logger from '../../modules/Logger';
import MutePlayerRequest from '../../../../Common/Requests/MutePlayerRequest';
import PlayerHasPermission from '../../utils/PlayerHasPermission';
import Permission from '../../../../Common/Enums/Permission';
import PunishmentEvents from '../../events/PunishmentEvents';
import session = require('express-session');
import SessionService from '../../services/SessionService';

@SocketController()
export default class ChatSocketController {
	private readonly chatEvents = new ChatEvents();
	private readonly punishmentEvents = new PunishmentEvents();

	private readonly chatService = new ChatService();
	private readonly playerService = new PlayerService();
	private readonly sessionService = new SessionService();

	/**
	 * Handles a player sending a chat message
	 * @param socket
	 * @param io
	 * @param command
	 */
	@OnMessage('sendMessage')
	async sendMessage(
		@SocketRequest() req: SocketRequestWithPlayer,
		@SocketIO() io: Server,
		@MessageBody() payload: SendMessageRequest
	) {
		Logger.logDebug('Received request to send chat message', {
			steamid: req.session.player.steamid,
			message: payload.messageContent
		});
		const { steamid, alias } = req.session.player;
		const isCurrentlyMutedInChat = await this.playerService.isCurrentlyMutedInChat(req.session.player.steamid);
		if (!isCurrentlyMutedInChat) {
			ValidateClass(payload);
			await this.chatEvents.sendPlayerMessage(req.session.player.steamid, payload.messageContent);
		} else {
			Logger.logWarning(`${alias} tried to send message while chat muted`, {
				steamid,
				message: payload.messageContent
			});
		}
	}

	@OnMessage('getMessageHistory')
	getMessageHistory(@ConnectedSocket() socket: Socket) {
		const messageHistory = this.chatService.getMessageHistory();
		socket.emit('getMessageHistory', messageHistory);
	}

	@OnMessage('mutePlayer')
	async mutePlayer(@SocketRequest() req: SocketRequestWithPlayer, @MessageBody() payload: MutePlayerRequest) {
		ValidateClass(payload);
		const { steamid } = req.session.player;
		const player = await this.sessionService.getPlayer(steamid);
		if (PlayerHasPermission(Permission.MUTE_PLAYER, player)) {
			this.punishmentEvents.mutePlayer(
				player.steamid,
				payload.playerToMuteSteamID,
				payload.expirationDate,
				payload.reason
			);
		}
	}
}
