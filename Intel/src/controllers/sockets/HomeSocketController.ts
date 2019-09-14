import {
	SocketController,
	OnConnect,
	ConnectedSocket,
	OnMessage,
	SocketIO,
	OnDisconnect,
	SocketRooms,
	EmitOnSuccess,
	SocketRequest
} from 'socket-controllers';
import * as dotenv from 'dotenv';
import PlayerViewModel from '../../../../Common/ViewModels/PlayerViewModel';
import PlayerService from '../../services/PlayerService';
import SessionService from '../../services/SessionService';
import DraftService from '../../services/DraftService';
import { SiteConfiguration } from '../../constants/SiteConfiguration';
import { Socket, Server } from 'socket.io';
import ValidateClass from '../../utils/ValidateClass';
import Player from '../../entities/Player';
import SocketRequestWithPlayer from '../../interfaces/SocketRequestWithPlayer';
import { FAKE_OFFLINE_STEAMID } from '../../utils/Seed';

const env = dotenv.config().parsed;

@SocketController()
export class HomeSocketController {
	private readonly playerService = new PlayerService();
	private readonly sessionService = new SessionService();
	private readonly draftService = new DraftService();

	@OnConnect()
	async playerConnected(
		@ConnectedSocket() socket: SocketRequestWithPlayer,
		@SocketIO() io: Server,
		@SocketRooms() rooms: any
	) {
		socket.emit('siteConfiguration', SiteConfiguration);
		if (socket.request.session.err) {
			socket.emit('serverError', socket.request.session.err);
		}

		if (socket.request.session.player) {
			const player = socket.request.session.player;
			const isCurrentlySiteBanned = await this.playerService.isCurrentlySiteBanned(player.steamid);
			const playerViewModel = PlayerViewModel.fromPlayer(player);
			playerViewModel.isBanned = isCurrentlySiteBanned;
			playerViewModel.isLoggedIn = !isCurrentlySiteBanned;
			socket.join(player.steamid);
			socket.emit('updateCurrentPlayer', playerViewModel);
		} else {
			// Used for development
			if (env.offline.toLowerCase() === 'true') {
				if (!(await this.sessionService.playerExists(FAKE_OFFLINE_STEAMID))) {
					await this.sessionService.addFakePlayer(FAKE_OFFLINE_STEAMID, socket.request.session.id);
				}
				const player = await this.playerService.getPlayer(FAKE_OFFLINE_STEAMID);
				socket.request.session.player = player;

				const isCurrentlySiteBanned = await this.playerService.isCurrentlySiteBanned(player.steamid);
				const playerViewModel = PlayerViewModel.fromPlayer(player);
				playerViewModel.isBanned = isCurrentlySiteBanned;
				playerViewModel.isLoggedIn = !isCurrentlySiteBanned;
				socket.emit('updateCurrentPlayer', playerViewModel);
			} else {
				socket.emit('updateCurrentPlayer', { loggedIn: false });
			}
		}
	}

	@OnMessage('playerLoadedHomepage')
	async playerLoadedHomepage(
		@ConnectedSocket() socket: SocketRequestWithPlayer,
		@SocketIO() io: Server,
		@SocketRooms() rooms: any
	) {
		const loggedInPlayers = await this.sessionService.getAllPlayers();
		const playerViewModels = loggedInPlayers
			.filter(player => player.alias !== undefined)
			.map(player => PlayerViewModel.fromPlayer(player));
		socket.emit('getLoggedInPlayers', playerViewModels);
		const { steamid } = socket.request.session.player;
		if (steamid) {
			socket.join(steamid);
		}
		if (io.sockets.adapter.rooms[steamid].length === 1) {
			this.sessionService.upsertPlayer(socket.request.session.id, steamid);
			if (socket.request.session.player.alias) {
				ValidateClass(socket.request.session.player);
				io.emit('addPlayerToSession', await this.sessionService.getPlayer(steamid));
			}
		}
	}

	@OnDisconnect()
	playerDisconnected(
		@ConnectedSocket() socket: Socket,
		@SocketIO() io: Server,
		@SocketRequest() request: SocketRequestWithPlayer
	) {
		if (!request.session.player.alias) return;

		if (0 === 0) {
			this.draftService.removePlayerFromAllDraftTFClasses(request.session.player.steamid);

			SiteConfiguration.gamemodeClassSchemes.forEach(scheme => {
				io.emit('removePlayerFromDraftTFClass', scheme.tf2class, request.session.player.steamid);
			});

			this.sessionService.removePlayer(request.session.player.steamid);
			io.emit('removePlayerFromSession', request.session.player.steamid);
		}
	}
}
