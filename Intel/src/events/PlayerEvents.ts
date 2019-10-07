import PlayerSettings from '../entities/PlayerSettings';
import SteamID from '../../../Common/Types/SteamID';
import PlayerService from '../services/PlayerService';
import SocketWithPlayer from '../interfaces/SocketWithPlayer';
import { Socket, Server } from 'socket.io';
import DraftEvents from './DraftEvents';
import SessionService from '../services/SessionService';
import PlayerViewModel from '../../../Common/ViewModels/PlayerViewModel';
import { io } from '../server';
import PermissionGroup from '../../../Common/Enums/PermissionGroup';
import Role from '../../../Common/Enums/Role';
import Player from '../entities/Player';

export default class PlayerEvents {
	private readonly draftEvents = new DraftEvents();

	private readonly playerService = new PlayerService();
	private readonly sessionService = new SessionService();

	logout(socket: SocketWithPlayer, steamid: SteamID) {
		this.disconnectPlayer(socket, steamid);
		socket.request.session.player = undefined;
		socket.request.session.save();
	}

	disconnectPlayer(socket: SocketWithPlayer, steamid: SteamID) {
		this.draftEvents.removePlayerFromAllDraftTFClasses(steamid);
		this.sessionService.removePlayer(steamid);
		io.emit('removePlayerFromSession', steamid);
		socket.emit('updateCurrentPlayer', new PlayerViewModel());
	}

	async updateLoggedInPlayer(player: Player) {
		const viewmodel = PlayerViewModel.fromPlayer(player);
		io.to(player.steamid).emit('updateCurrentPlayer', viewmodel);
		io.emit('updatePlayerGlobally', viewmodel);
	}

	async updateSettings(socket: SocketWithPlayer, steamid: SteamID, settings: PlayerSettings) {
		await this.playerService.updateSettings(steamid, settings);
		socket.request.session.player.settings = settings;
		socket.request.session.save();
	}

	async updateRoles(steamid: SteamID, roles: Role[]) {
		const player = await this.playerService.updateRoles(steamid, roles);
		this.updateLoggedInPlayer(player);
	}

	async updatePermissionGroup(steamid: SteamID, permissionGroup: PermissionGroup) {
		const player = await this.playerService.updatePermissionGroup(steamid, permissionGroup);
		this.updateLoggedInPlayer(player);
	}
}
