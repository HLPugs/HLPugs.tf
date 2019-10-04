import { SocketController, SocketIO, OnMessage, ConnectedSocket, MessageBody } from 'socket-controllers';
import PlayerService from '../../services/PlayerService';
import PlayerViewModel from '../../../../Common/ViewModels/PlayerViewModel';
import { LinqRepository } from 'typeorm-linq-repository';
import SubmitAliasRequest from '../../../../Common/Requests/SubmitAliasRequest';
import CheckIfAliasIsTakenRequest from '../../../../Common/Requests/CheckIfAliasIsTakenRequest';
import Player from '../../entities/Player';
import ValidateClass from '../../utils/ValidateClass';
import SessionService from '../../services/SessionService';
import { Socket, Server } from 'socket.io';
import SocketWithPlayer from '../../interfaces/SocketWithPlayer';
import { ALIAS_REGEX_PATTERN } from '../../../../Common/Constants/AliasConstraints';

@SocketController()
export class AliasSocketController {
	private readonly playerService = new PlayerService();
	private readonly sessionService = new SessionService();

	@OnMessage('submitAlias')
	async submitAlias(
		@ConnectedSocket() socket: Socket,
		@SocketIO() io: Server,
		@MessageBody() payload: SubmitAliasRequest
	) {
		ValidateClass(payload);
		const { alias } = payload;
		const aliasRules = new RegExp(ALIAS_REGEX_PATTERN);
		const aliasIsTaken = await this.isAliasTaken(alias);
		const aliasMatchesRegexCheck = aliasRules.test(alias);

		if (aliasIsTaken || !aliasMatchesRegexCheck) return;

		const { steamid } = socket.request.session.player;
		await this.playerService.updateAlias(steamid, alias);

		socket.request.session.player.alias = alias;
		socket.request.session.save();
		socket.request.session.reload(async (err: string) => {
			if (err) throw new Error(err);
			const player: Player = socket.request.session.player;
			this.sessionService.upsertPlayer(steamid, socket.request.session.id);
			const playerViewModel = PlayerViewModel.fromPlayer(player);
			socket.emit('updateCurrentPlayer', playerViewModel);
			socket.emit('hideAliasModal');
			io.emit('addPlayerToSession', playerViewModel);
		});
	}

	@OnMessage('checkIfAliasIsTaken')
	async checkIfAliasIsTaken(
		@ConnectedSocket() socket: SocketWithPlayer,
		@MessageBody() payload: CheckIfAliasIsTakenRequest
	) {
		ValidateClass(payload);
		const aliasIsTaken = await this.isAliasTaken(payload.alias);
		socket.emit('checkIfAliasIsTaken', aliasIsTaken);
	}

	private async isAliasTaken(alias: string) {
		const playerRepository = new LinqRepository(Player);
		return (
			(await playerRepository
				.getOne()
				.where(p => p.alias)
				.equal(alias)
				.count()) > 0
		);
	}
}
