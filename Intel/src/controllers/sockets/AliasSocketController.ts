import { SocketController, SocketIO, OnMessage, ConnectedSocket, MessageBody } from 'socket-controllers';
import PlayerService from '../../services/PlayerService';
import PlayerViewModel from '../../../../Common/ViewModels/PlayerViewModel';
import { LinqRepository } from 'typeorm-linq-repository';
import Player from '../../entities/Player';
import ValidateClass from '../../utils/ValidateClass';
import SessionService from '../../services/SessionService';
import { Socket, Server } from 'socket.io';

const playerService = new PlayerService();
const sessionService = new SessionService();

@SocketController()
export class AliasSocketController {
	@OnMessage('submitAlias')
	async submitAlias(@ConnectedSocket() socket: Socket, @SocketIO() io: Server, @MessageBody() body: any) {
		const alias: string = body.alias;
		const aliasRules = new RegExp('^[a-zA-Z0-9_]{2,17}$');

		if (!aliasRules.test(alias) || (await playerService.playerExists(alias))) return;

		const steamid = socket.request.session.player.steamid;
		await playerService.updateAlias(steamid, alias);

		socket.request.session.player.alias = alias;
		socket.request.session.save();
		const user: PlayerViewModel = socket.request.session.player;
		user.isLoggedIn = true;
		ValidateClass(user);
		socket.emit('user', user);
		sessionService.addPlayer(socket.request.session.id, steamid);
		io.emit('addPlayerToSession', await sessionService.getPlayer(steamid));
	}

	@OnMessage('checkAlias')
	async checkAlias(@ConnectedSocket() socket: any, @MessageBody() body: any) {
		const player = await this.aliasExists(body.alias);
		socket.emit('aliasStatus', player);
	}

	private async aliasExists(alias: string) {
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
