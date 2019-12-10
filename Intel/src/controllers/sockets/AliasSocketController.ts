import { SocketController, SocketIO, OnMessage, ConnectedSocket, MessageBody } from 'socket-controllers';
import PlayerService from '../../services/PlayerService';
import PlayerViewModel from '../../../../Common/ViewModels/PlayerViewModel';
import { LinqRepository } from 'typeorm-linq-repository';
import SubmitAliasRequest from '../../../../Common/Requests/SubmitAliasRequest';
import CheckIfAliasIsTakenRequest from '../../../../Common/Requests/CheckIfAliasIsTakenRequest';
import ValidateClass from '../../utils/ValidateClass';
import SessionService from '../../services/SessionService';
import { Socket, Server } from 'socket.io';
import SocketWithPlayer from '../../interfaces/SocketWithPlayer';
import { ALIAS_REGEX_PATTERN } from '../../../../Common/Constants/AliasConstraints';
import PlayerEvents from '../../events/PlayerEvents';

@SocketController()
export class AliasSocketController {
	private readonly playerEvents = new PlayerEvents();

	private readonly playerService = new PlayerService();

	@OnMessage('submitAlias')
	async submitAlias(@ConnectedSocket() socket: SocketWithPlayer, @MessageBody() payload: SubmitAliasRequest) {
		ValidateClass(payload);
		await this.playerEvents.submitAlias(
			socket.request.session.player.steamid,
			payload.alias,
			socket.request.session.id
		);
	}

	@OnMessage('checkIfAliasIsTaken')
	async checkIfAliasIsTaken(
		@ConnectedSocket() socket: SocketWithPlayer,
		@MessageBody() payload: CheckIfAliasIsTakenRequest
	) {
		ValidateClass(payload);
		const aliasIsTaken = await this.playerService.isAliasTaken(payload.alias);
		socket.emit('checkIfAliasIsTaken', aliasIsTaken);
	}
}
