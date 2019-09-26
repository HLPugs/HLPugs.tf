import { Server, Socket } from 'socket.io';
import { SocketIO, SocketController, OnMessage, MessageBody, SocketRequest, ConnectedSocket } from 'socket-controllers';
import SendMessageRequest from '../../../../Common/Requests/SendMessageRequest';
import Message from '../../../../Common/Models/Message';
import SocketRequestWithPlayer from '../../interfaces/SocketRequestWithPlayer';
import ValidateClass from '../../utils/ValidateClass';
import uuid = require('uuid');
import { chatService } from '../../services';

@SocketController()
export default class ChatSocketController {
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
		@MessageBody() body: SendMessageRequest
	) {
		const message: Message = {
			authorSteamid: req.session.player.steamid,
			messageContent: body.messageContent,
			timestamp: new Date().getTime(),
			username: req.session.player.alias,
			id: uuid()
		};

		ValidateClass(message);
		chatService.storePlayerMessage(message);
		io.emit('sendMessage', message);
	}

	@OnMessage('getMessageHistory')
	getMessageHistory(@ConnectedSocket() socket: Socket) {
		const messageHistory = chatService.getMessageHistory();
		socket.emit('getMessageHistory', messageHistory);
	}
}
