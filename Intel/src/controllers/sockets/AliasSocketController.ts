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
import { Validate } from 'class-validator';

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
		const aliasRules = new RegExp('^[a-zA-Z0-9_]{2,17}$');

		if (!aliasRules.test(alias) || (await this.isAliasTaken(alias))) return;

		const steamid = socket.request.session.player.steamid;
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
