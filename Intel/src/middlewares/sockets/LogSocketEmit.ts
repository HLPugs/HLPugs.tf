import { Middleware, MiddlewareInterface } from 'socket-controllers';
import Logger from '../../modules/Logger';
import SocketWithPlayer from '../../interfaces/SocketWithPlayer';
import PlayerService from '../../services/PlayerService';

@Middleware()
export default class AddFakePlayerToSession implements MiddlewareInterface {
	private readonly playerService = new PlayerService();
	async use(socket: SocketWithPlayer, next: (err?: any) => any) {
		if (process.env.NODE_ENV === 'dev') {
			const cookies = (socket.request.headers.cookie as string).split('; ');
			for (const cookie of cookies) {
				if (cookie.includes('steamid')) {
					const steamid = cookie.replace('steamid=', '');
					if (await this.playerService.playerExists(steamid)) {
						const player = await this.playerService.getPlayer(steamid);
						socket.request.session.player = player;
						socket.request.session.save();
					}
				}
			}
		}
		next();
	}
}
