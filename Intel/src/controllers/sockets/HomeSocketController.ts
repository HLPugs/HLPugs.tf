import {
	SocketController,
	OnConnect,
	ConnectedSocket,
	OnMessage,
	SocketIO,
	OnDisconnect,
	SocketRooms,
	SocketRequest
} from 'socket-controllers';
import * as dotenv from 'dotenv';
import PlayerViewModel from '../../../../Common/ViewModels/PlayerViewModel';
import { SiteConfiguration } from '../../constants/SiteConfiguration';
import { Socket, Server } from 'socket.io';
import SocketRequestWithPlayer from '../../interfaces/SocketRequestWithPlayer';
import ValidateClass from '../../utils/ValidateClass';
import { sessionService, draftService } from '../../services';

const env = dotenv.config().parsed;

@SocketController()
export class HomeSocketController {
	@OnConnect()
	async socketConnected(@ConnectedSocket() socket: Socket, @SocketIO() io: Server, @SocketRooms() rooms: any) {
		socket.emit('siteConfiguration', SiteConfiguration);
		if (socket.request.session.err) {
			socket.emit('serverError', socket.request.session.err);
		}

		if (socket.request.session.player) {
			if (socket.request.session.player.alias) {
				const player = socket.request.session.player;
				const playerViewModel = PlayerViewModel.fromPlayer(player);
				socket.join(player.steamid);
				socket.emit('updateCurrentPlayer', playerViewModel);
			} else {
				socket.emit('showAliasModal');
			}
		}
	}

	@OnMessage('playerLoadedHomepage')
	async playerLoadedHomepage(@ConnectedSocket() socket: Socket, @SocketIO() io: Server, @SocketRooms() rooms: any) {
		if (socket.request.session.player) {
			const { steamid } = socket.request.session.player;

			if (steamid) {
				socket.join(steamid);
			}
			if (!socket.request.session.player.alias) {
				if (io.sockets.adapter.rooms[steamid].length === 1) {
					sessionService.upsertPlayer(steamid, socket.request.session.id);
					const playerViewModel = PlayerViewModel.fromPlayer(await sessionService.getPlayer(steamid));
					io.emit('addPlayerToSession', ValidateClass(playerViewModel));
				}
			}
		}

		const loggedInPlayers = await sessionService.getAllPlayers();
		const playerViewModels = loggedInPlayers
			.filter(player => player.alias !== null && player.alias !== undefined) // Only send players who have made an alias
			.map(player => PlayerViewModel.fromPlayer(player));
		socket.emit('getLoggedInPlayers', playerViewModels);
	}

	@OnDisconnect()
	playerDisconnected(@SocketIO() io: Server, @SocketRequest() request: SocketRequestWithPlayer) {
		if (!request.session.player.alias) return;

		/* Don't disconnect the player and remove them from the draft if they close a connection and have multiple tabs/windows open
		 The player just disconnected, so if a room named by the player's steamid still exists, this means the player is still connected in another tab/window
		 We can confirm the player still has one or more tab/windows open by seeing if there is a room named by their SteamID and checking if it is undefined or not
		 *** IMPORTANT *** this will still remove the player from the draft (and everything else) if they reload the page or temporarily lose connection, however.
		 One possible solution is having a setTimeout() around the disconnect, and waiting approximately 10 seconds to see if the player is still disconnected. */
		if (io.sockets.adapter.rooms[request.session.player.steamid] !== undefined) return;
		draftService.removePlayerFromAllDraftTFClasses(request.session.player.steamid);

		SiteConfiguration.gamemodeClassSchemes.forEach(scheme => {
			io.emit('removePlayerFromDraftTFClass', scheme.tf2class, request.session.player.steamid);
		});

		sessionService.removePlayer(request.session.player.steamid);
		io.emit('removePlayerFromSession', request.session.player.steamid);
	}
}
