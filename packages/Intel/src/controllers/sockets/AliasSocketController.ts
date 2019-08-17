import { SocketController, OnMessage, ConnectedSocket, MessageBody, SocketQueryParam, NspParam, SocketRequest } from 'socket-controllers';
import PlayerService from '../../services/PlayerService';
import Player from '../../entities/Player';

const playerService = new PlayerService();

@SocketController()
export class AliasSocketController {

	@OnMessage('submitAlias')
	async submitAlias(@ConnectedSocket() socket: any, @MessageBody() body: any) {
		const alias: string = body.alias;
		const aliasRules = new RegExp('^[a-zA-Z0-9_]{2,17}$');

		if (!aliasRules.test(alias) || await this.isAliasTaken(alias)) return;
		
		const steamid = socket.request.session.user.steamid;
		await playerService.updateAlias(steamid, alias);
		
		const aliasUpdated = await this.isAliasTaken(alias);
		if (aliasUpdated) {
			socket.request.session.user.alias = alias;
			socket.request.session.save();
			const user = socket.request.session.user;
			user.loggedIn = true;

			socket.emit('user', user);
		}
	}


	@OnMessage('checkAlias')
	async checkAlias(@ConnectedSocket() socket: any, @MessageBody() body: any) {
		const player = await playerService.getPlayerByAlias(body.alias);
		socket.emit('aliasStatus', player);
	}

	private async isAliasTaken(alias: string): Promise<boolean> {
		const player = await playerService.getPlayerByAlias(alias);
		return player instanceof Player;
	}
}