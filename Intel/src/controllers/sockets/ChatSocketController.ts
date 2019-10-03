import { Server, Socket } from 'socket.io';
import { SocketIO, SocketController, OnMessage, MessageBody, SocketRequest, ConnectedSocket } from 'socket-controllers';
import ChatService from '../../services/ChatService';
import SendMessageRequest from '../../../../Common/Requests/SendMessageRequest';
import Message from '../../../../Common/Models/Message';
import SocketRequestWithPlayer from '../../interfaces/SocketRequestWithPlayer';
import ValidateClass from '../../utils/ValidateClass';
import uuid = require('uuid');

@SocketController()
export default class ChatSocketController {
	private readonly chatService = new ChatService();

	/**
	 * Handles a player sending a chat message
	 * @param socket
	 * @param io
	 * @param command
	 */
	@OnMessage('sendMessage')
	sendMessage(
		@SocketRequest() req: SocketRequestWithPlayer,
		@SocketIO() io: Server,
		@MessageBody() payload: SendMessageRequest
	) {
		const message: Message = {
			authorSteamid: req.session.player.steamid,
			messageContent: payload.messageContent,
			timestamp: new Date().getTime(),
			username: req.session.player.alias,
			id: uuid()
		};

		ValidateClass(message);
		this.chatService.storePlayerMessage(message);
		io.emit('sendMessage', message);
	}

	@OnMessage('getMessageHistory')
	getMessageHistory(@ConnectedSocket() socket: Socket) {
		const messageHistory = this.chatService.getMessageHistory();
		socket.emit('getMessageHistory', messageHistory);
	}
}
