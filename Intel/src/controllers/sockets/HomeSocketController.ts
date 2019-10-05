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
import PlayerViewModel from '../../../../Common/ViewModels/PlayerViewModel';
import PlayerService from '../../services/PlayerService';
import SessionService from '../../services/SessionService';
import DraftService from '../../services/DraftService';
import { SiteConfiguration } from '../../constants/SiteConfiguration';
import { Socket, Server } from 'socket.io';
import SocketRequestWithPlayer from '../../interfaces/SocketRequestWithPlayer';
import DebugService from '../../services/DebugService';
import ValidateClass from '../../utils/ValidateClass';
import SocketWithPlayer from '../../interfaces/SocketWithPlayer';
import DraftEvents from '../../events/DraftEvents';
import PlayerEvents from '../../events/PlayerEvents';

@SocketController()
export class HomeSocketController {
	private readonly playerEvents = new PlayerEvents();
	private readonly draftEvents = new DraftEvents();

	private readonly playerService = new PlayerService();
	private readonly sessionService = new SessionService();
	private readonly draftService = new DraftService();

	@OnConnect()
	async socketConnected(
		@ConnectedSocket() socket: Socket,
		@SocketRequest() request: SocketRequestWithPlayer,
		@SocketIO() io: Server,
		@SocketRooms() rooms: any
	) {
		socket.emit('siteConfiguration', SiteConfiguration);
		if (socket.request.session.err) {
			socket.emit('serverError', socket.request.session.err);
		}

		if (request.session.player) {
			if (request.session.player.alias) {
				const player = request.session.player;
				socket.join(player.steamid);
				const playerViewModel = PlayerViewModel.fromPlayer(player);
				socket.emit('updateCurrentPlayer', playerViewModel);
				const isCurrentlySiteBanned = await this.playerService.isCurrentlySiteBanned(player.steamid);
				if (isCurrentlySiteBanned) {
					socket.emit('playerIsBanned');
				}
			} else {
				socket.emit('showAliasModal');
			}
		} else {
			socket.emit('updateCurrentPlayer', new PlayerViewModel());
		}
	}

	@OnMessage('playerLoadedHomepage')
	async playerLoadedHomepage(
		@ConnectedSocket() socket: SocketWithPlayer,
		@SocketIO() io: Server,
		@SocketRooms() rooms: any
	) {
		if (socket.request.session.player) {
			const { player } = socket.request.session;

			if (player.steamid) {
				socket.join(player.steamid);
			}
			if (io.sockets.adapter.rooms[player.steamid].length === 1) {
				this.sessionService.upsertPlayer(player.steamid, socket.request.session.id);
				const playerViewModel = PlayerViewModel.fromPlayer(await this.sessionService.getPlayer(player.steamid));
				io.emit('addPlayerToSession', ValidateClass(playerViewModel));
			}
			if (player.settings.addToFavoritesOnLogin) {
				player.settings.favoriteClasses.forEach(draftTFClass => {
					this.draftEvents.addPlayerToDraftTFClass(io, player.steamid, draftTFClass);
				});
			}
		}

		const loggedInPlayers = await this.sessionService.getAllPlayers();
		const playerViewModels = loggedInPlayers
			.filter(player => player.alias !== null && player.alias !== undefined) // Only send players who have made an alias
			.map(player => PlayerViewModel.fromPlayer(player));
		socket.emit('getLoggedInPlayers', playerViewModels);
	}

	@OnDisconnect()
	playerDisconnected(@SocketIO() io: Server, @SocketRequest() request: SocketRequestWithPlayer) {
		if (!request.session.player.alias) return;
		const { steamid } = request.session.player;

		/* Don't disconnect the player and remove them from the draft if they close a connection and have multiple tabs/windows open
		 The player just disconnected, so if a room named by the player's steamid still exists, this means the player is still connected in another tab/window
		 We can confirm the player still has one or more tab/windows open by seeing if there is a room named by their SteamID and checking if it is undefined or not
		 *** IMPORTANT *** this will still remove the player from the draft (and everything else) if they reload the page or temporarily lose connection, however.
		 One possible solution is having a setTimeout() around the disconnect, and waiting approximately 10 seconds to see if the player is still disconnected. */
		if (io.sockets.adapter.rooms[steamid] !== undefined) return;
		this.draftService.removePlayerFromAllDraftTFClasses(steamid);

		SiteConfiguration.gamemodeClassSchemes.forEach(scheme => {
			this.draftEvents.removePlayerFromDraftTFClass(io, steamid, scheme.tf2class);
		});

		this.sessionService.removePlayer(request.session.player.steamid);
		io.emit('removePlayerFromSession', request.session.player.steamid);
	}

	@OnMessage('logout')
	logout(@SocketIO() io: Server, @ConnectedSocket() socket: SocketWithPlayer) {
		this.playerEvents.logout(io, socket, socket.request.session.player.steamid);
	}
}
