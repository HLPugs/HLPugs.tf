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
import FakeAddPlayerToDraftTFClassRequest from '../../../../Common/Requests/FakeAddPlayerToDraftTFClassRequest';
import FakeRemovePlayerFromDraftTFClassRequest from '../../../../Common/Requests/FakeRemovePlayerFromDraftTFClassRequest';
import DraftService from '../../services/DraftService';
import PermissionGroup from '../../../../Common/Enums/PermissionGroup';

@SocketController()
export default class DebugSocketController {
	private readonly playerService = new PlayerService();
	private readonly sessionService = new SessionService();
	private readonly debugService = new DebugService();
	private readonly draftService = new DraftService();

	@OnMessage('fakeLogin')
	async fakeLogin(@ConnectedSocket() socket: Socket, @SocketIO() io: Server) {
		if (process.env.NODE_ENV === 'dev') {
			if (!this.sessionService.playerExists(DebugService.FAKE_OFFLINE_STEAMID)) {
				await this.debugService.addFakePlayer(DebugService.FAKE_OFFLINE_STEAMID, socket.request.sessionID);
			}
			const player = await this.playerService.getPlayer(DebugService.FAKE_OFFLINE_STEAMID);
			socket.request.session.player = player;
			socket.request.session.save();
			const playerViewModel = PlayerViewModel.fromPlayer(player);
			socket.emit('updateCurrentPlayer', playerViewModel);
		}
	}

	@OnMessage('fakeLogout')
	async fakeLogout(@ConnectedSocket() socket: Socket, @SocketIO() io: Server, @MessageBody() body: FakeLogoutRequest) {
		if (process.env.NODE_ENV === 'dev') {
			ValidateClass(body);
			SiteConfiguration.gamemodeClassSchemes.forEach(scheme => {
				io.emit('removePlayerFromDraftTFClass', scheme.tf2class, body.steamid);
			});

			this.sessionService.removePlayer(body.steamid);
			io.emit('removePlayerFromSession', body.steamid);

			const playerViewModel = PlayerViewModel.fromPlayer(await this.playerService.getPlayer(body.steamid));
			playerViewModel.isLoggedIn = false;
			playerViewModel.isBanned = false;
			socket.emit('updateCurrentPlayer', ValidateClass(playerViewModel));
		}
	}

	@OnMessage('addFakePlayer')
	async addFakePlayer(@SocketIO() io: Server, @SocketRequest() request: SocketRequestWithPlayer) {
		if (process.env.NODE_ENV === 'dev') {
			const player = await this.debugService.addFakePlayer();
			const fakePlayerViewModel = PlayerViewModel.fromPlayer(player);

			io.emit('addPlayerToSession', fakePlayerViewModel);
		}
	}

	@OnMessage('fakeAddPlayerToDraftTFClass')
	fakeAddPlayerToDraftTFClass(@SocketIO() io: Server, @MessageBody() body: FakeAddPlayerToDraftTFClassRequest) {
		ValidateClass(body);
		this.draftService.addPlayerToDraftTFClass(body.steamid, body.draftTFClass);
		io.emit('addPlayerToDraftTFClass', body.draftTFClass, body.steamid);
	}

	@OnMessage('fakeRemovePlayerFromDraftTFClass')
	fakeRemovePlayerToDraftTFClass(@SocketIO() io: Server, @MessageBody() body: FakeRemovePlayerFromDraftTFClassRequest) {
		ValidateClass(body);
		this.draftService.removePlayerFromDraftTFClass(body.steamid, body.draftTFClass);
		io.emit('removePlayerFromDraftTFClass', body.draftTFClass, body.steamid);
	}
}
