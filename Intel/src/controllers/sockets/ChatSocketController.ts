import { Server } from 'socket.io';
import { SocketIO, SocketController, OnMessage, MessageBody, SocketRequest } from 'socket-controllers';
import ChatService from '../../services/ChatService';
import SendMessageRequest from '../../../../Common/Requests/SendMessageRequest';
import Message from '../../../../Common/Models/Message';
import SocketRequestWithPlayer from '../../interfaces/SocketRequestWithPlayer';

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
		@MessageBody() body: SendMessageRequest
	) {
		const message = Message.fromRequest(body, req.session.player);
		this.chatService.storePlayerMessage(message);

		io.emit('newMessage', message);
	}
}
