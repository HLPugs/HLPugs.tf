import { Socket } from 'socket.io';
import { SocketIO, SocketController, OnMessage, MessageBody, ConnectedSocket } from 'socket-controllers';
import GetBannedPageViewModelRequest from '../../../../Common/Requests/GetBannedPageViewModelRequest';
import ValidateClass from '../../utils/ValidateClass';
import PlayerService from '../../services/PlayerService';
import PunishmentType from '../../../../Common/Enums/PunishmentType';
import Punishment from '../../../../Common/Models/Punishment';

@SocketController()
export default class BannedSocketController {
	private readonly playerService = new PlayerService();

	@OnMessage('getBannedPageViewModel')
	async getBannedPageViewModel(
		@ConnectedSocket() socket: Socket,
		@MessageBody() payload: GetBannedPageViewModelRequest
	) {
		ValidateClass(payload);
		const activePunishments = await this.playerService.getActivePunishments(payload.steamid);
		const activeBan = activePunishments.filter(p => p.punishmentType === PunishmentType.BAN)[0];

		const bannedPageViewModel = Punishment.toBannedPageViewModel(activeBan);
		socket.emit('getBannedPageViewModel', bannedPageViewModel);
	}
}
