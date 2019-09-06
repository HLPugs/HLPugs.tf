import { SocketController, OnConnect, ConnectedSocket, OnMessage, SocketIO, OnDisconnect } from 'socket-controllers';
import * as dotenv from 'dotenv';
import PlayerViewModel from '../../../../Common/ViewModels/PlayerViewModel';
import PlayerService from '../../services/PlayerService';
import SessionService from '../../services/SessionService';
import DraftService from '../../services/DraftService';
import { SiteConfiguration } from '../../constants/SiteConfiguration';
import { Socket, Server } from 'socket.io';
import ValidateClass from '../../utils/ValidateClass';
import Player from '../../entities/Player';

const env = dotenv.config().parsed;

@SocketController()
export class HomeSocketController {
	private readonly playerService = new PlayerService();
	private readonly sessionService = new SessionService();
	private readonly draftService = new DraftService();

	@OnConnect()
	async playerConnected(@ConnectedSocket() socket: Socket) {
		socket.emit('siteConfiguration', SiteConfiguration);
		if (socket.request.session.err) {
			socket.emit('serverError', socket.request.session.err);
		}

		if (socket.request.session.player) {
			const playerViewModel: PlayerViewModel = socket.request.session.player;
			socket.emit('user', playerViewModel);
		} else {
			// Used for development
			if (env.offline.toLowerCase() === 'true') {
				const player = await this.playerService.getPlayer('76561198119135809');
				this.sessionService.addFakePlayer(player, socket.request.session.id);
				const playerViewModel = PlayerViewModel.fromPlayer(player);
				playerViewModel.isLoggedIn = true;
				ValidateClass(playerViewModel);
				socket.request.session.player = playerViewModel;
				socket.emit('user', playerViewModel);
			} else {
				socket.emit('user', { loggedIn: false });
			}
		}
	}

	@OnMessage('playerLoadedHomepage')
	async playerLoadedHomepage(@ConnectedSocket() socket: Socket, @SocketIO() io: Server) {
		const loggedInPlayers = await this.sessionService.getAllPlayers();
		const playerViewModels = loggedInPlayers.map(player => PlayerViewModel.fromPlayer(player));
		socket.emit('getLoggedInPlayers', playerViewModels);

		// Add new socket to session socket list
		if (socket.request.session.sockets !== undefined) {
			socket.request.session.sockets.push(socket.id);
			socket.request.session.save((e: any) => {
				if (e) throw e;
			});
			if (socket.request.session.sockets.length === 1) {
				this.sessionService.addPlayer(socket.request.session.id, socket.request.session.player.steamid);
				if (socket.request.session.player.alias) {
					ValidateClass(socket.request.session.player as Player);
					io.emit('addPlayerToSession', await this.sessionService.getPlayer(socket.request.session.player.steamid));
				}
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
