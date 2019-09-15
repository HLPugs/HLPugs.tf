import { Socket, Server } from 'socket.io';
import { SocketIO, SocketController, OnMessage, MessageBody, ConnectedSocket, SocketRequest } from 'socket-controllers';
import ValidateClass from '../../utils/ValidateClass';
import SessionService from '../../services/SessionService';
import DebugService from '../../services/DebugService';
import SocketRequestWithPlayer from '../../interfaces/SocketRequestWithPlayer';
import PlayerService from '../../services/PlayerService';
import PlayerViewModel from '../../../../Common/ViewModels/PlayerViewModel';
import { SiteConfiguration } from '../../constants/SiteConfiguration';
import FakeLogoutRequest from '../../../../Common/Requests/FakeLogoutRequest';
import PlayerSettings from '../../entities/PlayerSettings';

@SocketController()
export default class DebugSocketController {
	private readonly playerService = new PlayerService();
	private readonly sessionService = new SessionService();
	private readonly debugService = new DebugService();

	@OnMessage('fakeLogin')
	async fakeLogin(
		@ConnectedSocket() socket: Socket,
		@SocketRequest() request: SocketRequestWithPlayer,
		@SocketIO() io: Server
	) {
		if (process.env.NODE_ENV === 'dev') {
			if (!this.sessionService.playerExists(DebugService.FAKE_OFFLINE_STEAMID)) {
				await this.debugService.addFakePlayer(DebugService.FAKE_OFFLINE_STEAMID);
			}
			const player = await this.playerService.getPlayer(DebugService.FAKE_OFFLINE_STEAMID);
			request.session.player = player;
			const playerViewModel = PlayerViewModel.fromPlayer(player);
			playerViewModel.isBanned = await this.playerService.isCurrentlySiteBanned(player.steamid);
			playerViewModel.isLoggedIn = !playerViewModel.isLoggedIn;
			socket.emit('updateCurrentPlayer', playerViewModel);
			io.emit('addPlayerToSession', playerViewModel);
		}
	}

	@OnMessage('fakeLogout')
	fakeLogout(
		@ConnectedSocket() socket: Socket,
		@SocketRequest() request: SocketRequestWithPlayer,
		@SocketIO() io: Server,
		@MessageBody() body: FakeLogoutRequest
	) {
		ValidateClass(body);
		SiteConfiguration.gamemodeClassSchemes.forEach(scheme => {
			io.emit('removePlayerFromDraftTFClass', scheme.tf2class, body.steamid);
		});

		this.sessionService.removePlayer(body.steamid);
		io.emit('removePlayerFromSession', body.steamid);

		const playerViewModel = PlayerViewModel.fromPlayer(request.session.player);
		playerViewModel.isLoggedIn = false;
		playerViewModel.isBanned = false;
		socket.emit('updateCurrentPlayer', ValidateClass(playerViewModel));
	}
}
