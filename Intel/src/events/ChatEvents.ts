import Message from '../../../Common/Models/Message';

import uuid = require('uuid');
import SteamID from '../../../Common/Types/SteamID';
import PlayerService from '../services/PlayerService';
import ValidateClass from '../utils/ValidateClass';
import ChatService from '../services/ChatService';
import { io } from '../server';
import Logger from '../modules/Logger';
import PunishmentType from '../../../Common/Enums/PunishmentType';
import Punishment from '../../../Common/Models/Punishment';
import PunishmentService from '../services/PunishmentService';

export default class ChatEvents {
	private readonly playerService = new PlayerService();
	private readonly punishmentService = new PunishmentService();
	private readonly chatService = new ChatService();

	async sendPlayerMessage(steamid: SteamID, messageSent: string) {
		if (this.chatService.playerSentMessageTooFast(steamid)) {
			Logger.logWarning('Player tried sending a message too fast', { steamid, messageSent });
		} else {
			const player = await this.playerService.getPlayer(steamid);

			const message: Message = {
				authorSteamid: steamid,
				messageContent: messageSent,
				timestamp: new Date().getTime(),
				username: player.alias,
				id: uuid()
			};

			ValidateClass(message);
			this.chatService.storePlayerMessage(message);
			io.emit('sendMessage', message);
			Logger.logInfo('Chat messsage sent', { steamid, message: message.messageContent });
		}
	}
}
