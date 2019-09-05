import { SocketController, OnConnect, ConnectedSocket, OnMessage, SocketIO, OnDisconnect } from 'socket-controllers';
import * as dotenv from 'dotenv';
import PlayerViewModel from '../../../../Common/ViewModels/PlayerViewModel';
import PlayerService from '../../services/PlayerService';
import SessionService from '../../services/SessionService';
import { SiteConfiguration } from '../../constants/SiteConfiguration';

const env = dotenv.config().parsed;

const playerService = new PlayerService();
const sessionService = new SessionService();

@SocketController()
export class HomeSocketController {
	@OnConnect()
	async playerConnected(@ConnectedSocket() socket: any) {
		socket.emit('siteConfiguration', SiteConfiguration);
		if (socket.request.session.err) {
			socket.emit('serverError', socket.request.session.err);
		}

		if (socket.request.session.user) {
			const user: PlayerViewModel = socket.request.session.user;
			socket.emit('user', user);
		} else {
			// Used for development
			if (env.offline.toLowerCase() === 'true') {
				const user: any = await playerService.getPlayer('76561198119135809');
				socket.emit('user', user);
			} else {
				socket.emit('user', { loggedIn: false });
			}
		}
	}

	@OnMessage('home')
	async playerLoadedHomepage(@ConnectedSocket() socket: any, @SocketIO() io: any) {
		const loggedInPlayers = await sessionService.getAllPlayers();
		const playerViewModels = loggedInPlayers.map(player => PlayerViewModel.fromPlayer(player));
		socket.emit('getLoggedInPlayers', playerViewModels);

		// Add new socket to session socket list
		if (socket.request.session.sockets !== undefined) {
			socket.request.session.sockets.push(socket.id);
			socket.request.session.save((e: any) => {
				if (e) throw e;
			});
			if (socket.request.session.sockets.length === 1) {
				sessionService.addPlayer(socket.request.session.id, socket.request.session.user.steamid);
				io.emit('addPlayerToSession', await sessionService.getPlayer(socket.request.session.user.steamid));
			}
		}
	}

	@OnDisconnect()
	playerDisconnected(@ConnectedSocket() socket: any, @SocketIO() io: any) {
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
					//playerMap.removePlayerAllDraftTFClasses(
					//	socket.request.session.user.steamid
					//);

					SiteConfiguration.gamemodeClassSchemes.forEach(scheme => {
						io.emit('removePlayerFromDraftTFClass', scheme.tf2class, socket.request.session.user.steamid);
					});

					sessionService.removePlayer(socket.request.session.user.steamid);
					io.emit('removePlayerFromSession', socket.request.session.user.steamid);
				}
			}
		});
	}
}
