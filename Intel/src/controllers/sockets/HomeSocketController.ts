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
import SocketRequestWithPlayer from '../../interfaces/SocketRequestWithPlayer';
import DebugService from '../../services/DebugService';
import ValidateClass from '../../utils/ValidateClass';

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
			const playerViewModel = PlayerViewModel.fromPlayer(player);
			playerViewModel.isBanned = await this.playerService.isCurrentlySiteBanned(player.steamid);
			playerViewModel.isLoggedIn = !playerViewModel.isLoggedIn;
			socket.join(player.steamid);
			socket.emit('updateCurrentPlayer', playerViewModel);
		} else {
			socket.emit('updateCurrentPlayer', { loggedIn: false });
		}
	}

	@OnMessage('playerLoadedHomepage')
	async playerLoadedHomepage(
		@ConnectedSocket() socket: SocketRequestWithPlayer,
		@SocketIO() io: Server,
		@SocketRooms() rooms: any
	) {
		const { steamid } = socket.request.session.player;
		if (steamid) {
			socket.join(steamid);
		}
		if (io.sockets.adapter.rooms[steamid].length === 1) {
			this.sessionService.upsertPlayer(steamid, socket.request.session.id);
			if (socket.request.session.player.alias) {
				const playerViewModel = PlayerViewModel.fromPlayer(await this.sessionService.getPlayer(steamid));
				playerViewModel.isBanned = await this.playerService.isCurrentlySiteBanned(steamid);
				playerViewModel.isLoggedIn = playerViewModel.isLoggedIn;
				io.emit('addPlayerToSession', ValidateClass(playerViewModel));
			}
		}
		const loggedInPlayers = await this.sessionService.getAllPlayers();
		const playerViewModels = loggedInPlayers
			.filter(player => player.alias !== null && player.alias !== undefined) // Only send players who have made an alias
			.map(player => PlayerViewModel.fromPlayer(player));
		for (const vm of playerViewModels) {
			vm.isBanned = await this.playerService.isCurrentlySiteBanned(steamid);
			vm.isLoggedIn = !vm.isBanned;
		}
		socket.emit('getLoggedInPlayers', ValidateClass(playerViewModels));
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
		this.draftService.removePlayerFromAllDraftTFClasses(request.session.player.steamid);

		SiteConfiguration.gamemodeClassSchemes.forEach(scheme => {
			io.emit('removePlayerFromDraftTFClass', scheme.tf2class, request.session.player.steamid);
		});

		this.sessionService.removePlayer(request.session.player.steamid);
		io.emit('removePlayerFromSession', request.session.player.steamid);
	}
}
