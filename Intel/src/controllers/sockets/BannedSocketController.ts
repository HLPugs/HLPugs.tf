import { Socket } from 'socket.io';
import { SocketIO, SocketController, OnMessage, MessageBody, ConnectedSocket } from 'socket-controllers';
import GetBannedPageViewModelRequest from '../../../../Common/Requests/GetBannedPageViewModelRequest';
import ValidateClass from '../../utils/ValidateClass';
import PlayerService from '../../services/PlayerService';
import PunishmentType from '../../../../Common/Enums/PunishmentType';
import BannedPageViewModel from '../../../../Common/ViewModels/BannedPageViewModel';

@SocketController()
export default class BannedSocketController {
	private readonly playerService = new PlayerService();

	@OnMessage('getBannedPageViewModel')
	async getBannedPageViewModel(@ConnectedSocket() socket: Socket, @MessageBody() body: GetBannedPageViewModelRequest) {
		ValidateClass(body);
		const activePunishments = await this.playerService.getActivePunishments(body.steamid);
		const activeBan = activePunishments.filter(p => p.punishmentType === PunishmentType.BAN)[0];

		const bannedPageViewModel = BannedPageViewModel.fromBan(activeBan);
		socket.emit('getBannedPageViewModel', bannedPageViewModel);
	}
}
