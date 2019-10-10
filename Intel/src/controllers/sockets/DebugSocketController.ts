import { Socket, Server } from 'socket.io';
import { SocketIO, SocketController, OnMessage, MessageBody, ConnectedSocket, SocketRequest } from 'socket-controllers';
import ValidateClass from '../../utils/ValidateClass';
import SessionService from '../../services/SessionService';
import DebugService from '../../services/DebugService';
import SocketRequestWithPlayer from '../../interfaces/SocketRequestWithPlayer';
import PlayerService from '../../services/PlayerService';
import { SiteConfiguration } from '../../constants/SiteConfiguration';
import FakeLogoutRequest from '../../../../Common/Requests/FakeLogoutRequest';
import FakeAddPlayerToDraftTFClassRequest from '../../../../Common/Requests/FakeAddPlayerToDraftTFClassRequest';
import FakeAddPlayerToAllDraftTFClassesRequest from '../../../../Common/Requests/FakeAddPlayerToAllDraftTFClassesRequest';
import FakeRemovePlayerFromDraftTFClassRequest from '../../../../Common/Requests/FakeRemovePlayerFromDraftTFClassRequest';
import DraftService from '../../services/DraftService';
import DraftEvents from '../../events/DraftEvents';
import PlayerEvents from '../../events/PlayerEvents';
import FAKE_OFFLINE_STEAMID from '../../../../Common/Constants/FakeOfflineSteamid';
import { HomeSocketController } from './HomeSocketController';
import Logger from '../../modules/Logger';
import SocketWithPlayer from '../../interfaces/SocketWithPlayer';
import Player from '../../entities/Player';
import PlayerViewModel from '../../../../Common/ViewModels/PlayerViewModel';

@SocketController()
export default class DebugSocketController {
	private readonly playerEvents = new PlayerEvents();
	private readonly draftEvents = new DraftEvents();

	private readonly playerService = new PlayerService();
	private readonly sessionService = new SessionService();
	private readonly debugService = new DebugService();

	@OnMessage('fakeLogin')
	async fakeLogin(@ConnectedSocket() socket: SocketWithPlayer, @SocketIO() io: Server) {
		Logger.logDebug('Received fakeLogin request');
		if (process.env.NODE_ENV === 'dev') {
			if (!this.sessionService.playerExists(FAKE_OFFLINE_STEAMID)) {
				await this.debugService.addFakePlayer(FAKE_OFFLINE_STEAMID, socket.request.session.id);
				const player: Player = await this.playerService.getPlayer(FAKE_OFFLINE_STEAMID);
				socket.join(FAKE_OFFLINE_STEAMID);
				await this.sessionService.updatePlayer(player);
				socket.request.session.player = player;
				socket.request.session.save();
				const playerViewModel = await Player.toPlayerViewModel(player);
				socket.emit('updateCurrentPlayer', playerViewModel);
				io.emit('addPlayerToSession', playerViewModel);
				Logger.logInfo('Logged in successfully');
			}
		} else {
			Logger.logWarning('Tried to fake login during prod', socket.request.session.player);
		}
	}

	@OnMessage('fakeLogout')
	async fakeLogout(@ConnectedSocket() socket: Socket, @MessageBody() payload: FakeLogoutRequest) {
		Logger.logInfo('Received fakeLogout request');
		if (process.env.NODE_ENV === 'dev') {
			ValidateClass(payload);
			this.playerEvents.logout(socket, payload.steamid);
		}
	}

	@OnMessage('addFakePlayer')
	async addFakePlayer(@SocketIO() io: Server) {
		if (process.env.NODE_ENV === 'dev') {
			const player = await this.debugService.addFakePlayer();
			const fakePlayerViewModel = await Player.toPlayerViewModel(player);

			io.emit('addPlayerToSession', fakePlayerViewModel);
		}
	}

	@OnMessage('fakeAddPlayerToDraftTFClass')
	fakeAddPlayerToDraftTFClass(@MessageBody() payload: FakeAddPlayerToDraftTFClassRequest) {
		if (process.env.NODE_ENV === 'dev') {
			ValidateClass(payload);
			this.draftEvents.addPlayerToDraftTFClass(payload.steamid, payload.draftTFClass);
		}
	}

	@OnMessage('fakeRemovePlayerFromDraftTFClass')
	fakeRemovePlayerFromDraftTFClass(@MessageBody() payload: FakeRemovePlayerFromDraftTFClassRequest) {
		if (process.env.NODE_ENV === 'dev') {
			ValidateClass(payload);
			this.draftEvents.removePlayerFromDraftTFClass(payload.steamid, payload.draftTFClass);
		}
	}

	@OnMessage('fakeAddPlayerToAllDraftTFClasses')
	fakeAddPlayerToAllDraftTFClasses(@MessageBody() payload: FakeAddPlayerToAllDraftTFClassesRequest) {
		if (process.env.NODE_ENV === 'dev') {
			SiteConfiguration.gamemodeClassSchemes.forEach(scheme => {
				this.draftEvents.addPlayerToDraftTFClass(payload.steamid, scheme.tf2class);
			});
		}
	}
}
