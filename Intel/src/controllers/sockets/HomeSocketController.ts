import {
	SocketController,
	OnConnect,
	ConnectedSocket,
	OnMessage,
	SocketIO,
	OnDisconnect,
	SocketRooms,
	EmitOnSuccess
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
				await this.sessionService.addFakePlayer('76561198119135809', socket.request.session.id);
				const player = await this.playerService.getPlayer('76561198119135809');
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
	playerDisconnected(@ConnectedSocket() socket: Socket, @SocketIO() io: Server) {
		if (!socket.request.session || socket.request.session.sockets === undefined) return;

		socket.request.session.reload((e: any) => {
			if (e !== undefined) throw e;

			const socketIndex = socket.request.session.sockets.indexOf(socket.id);

			if (socketIndex >= 0) {
				socket.request.session.sockets.splice(socketIndex, 1);
				socket.request.session.save((e: Error) => {
					if (e !== undefined) {
						throw e;
					}
				});

				if (socket.request.session.sockets.length === 0) {
					this.draftService.removePlayerFromAllDraftTFClasses(socket.request.session.player.steamid);

					SiteConfiguration.gamemodeClassSchemes.forEach(scheme => {
						io.emit('removePlayerFromDraftTFClass', scheme.tf2class, socket.request.session.player.steamid);
					});

					this.sessionService.removePlayer(socket.request.session.player.steamid);
					io.emit('removePlayerFromSession', socket.request.session.player.steamid);
				}
			}
		});
	}
}
