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
import Logger from '../modules/Logger';
import SessionID from '../../../Common/Types/SessionID';
import { ALIAS_REGEX_PATTERN } from '../../../Common/Constants/AliasConstraints';

export default class PlayerEvents {
	private readonly draftEvents = new DraftEvents();

	private readonly playerService = new PlayerService();
	private readonly sessionService = new SessionService();

	logout(socket: SocketWithPlayer, steamid: SteamID) {
		this.disconnectPlayer(socket, steamid);
		socket.request.session.player = undefined;
		socket.request.session.save();
		Logger.logInfo('Logged out successfully', { steamid });
	}

	disconnectPlayer(socket: SocketWithPlayer, steamid: SteamID) {
		this.draftEvents.removePlayerFromAllDraftTFClasses(steamid);
		this.sessionService.removePlayer(steamid);
		io.emit('removePlayerFromSession', steamid);
		socket.emit('updateCurrentPlayer', new PlayerViewModel());
		Logger.logInfo('Disconnected player', { steamid });
	}

	async updateLoggedInPlayer(player: Player) {
		const playerViewModel = await Player.toPlayerViewModel(player);
		io.to(player.steamid).emit('updateCurrentPlayer', playerViewModel);
		io.emit('updatePlayerGlobally', playerViewModel);
	}

	async updateSettings(socket: SocketWithPlayer, steamid: SteamID, settings: PlayerSettings) {
		await this.playerService.updateSettings(steamid, settings);
		socket.request.session.player.settings = settings;
		socket.request.session.save();
		Logger.logInfo('Updated player settings', { steamid, settings });
	}

	async sendPlayerSettings(steamid: SteamID) {
		const settings = await this.playerService.getSettings(steamid);
		io.to(steamid).emit('getPlayerSettings', PlayerSettings.toPlayerSettingsViewmodel(settings));
		Logger.logInfo('Sent settings to player', { steamid, settings });
	}

	async updateRoles(steamid: SteamID, roles: Role[]) {
		const player = await this.playerService.updateRoles(steamid, roles);
		this.updateLoggedInPlayer(player);
		Logger.logInfo('Updated role', { steamid, roles });
	}

	async updatePermissionGroup(steamid: SteamID, permissionGroup: PermissionGroup) {
		const player = await this.playerService.updatePermissionGroup(steamid, permissionGroup);
		this.updateLoggedInPlayer(player);
		Logger.logInfo('Updated permission group', { steamid, permissionGroup });
	}

	async submitAlias(steamid: SteamID, alias: string, sessionId: SessionID) {
		const aliasRules = new RegExp(ALIAS_REGEX_PATTERN);
		const aliasIsTaken = await this.playerService.isAliasTaken(alias);
		const aliasMatchesRegexCheck = aliasRules.test(alias);

		if (aliasIsTaken || !aliasMatchesRegexCheck) return;

		const player = await this.playerService.updateAlias(steamid, alias);

		this.sessionService.associateSteamidWithSessionid(steamid, sessionId);
		const playerViewModel = await Player.toPlayerViewModel(player);
		io.to(steamid).emit('updateCurrentPlayer', playerViewModel);
		io.to(steamid).emit('hideAliasModal');
		io.emit('addPlayerToSession', playerViewModel);
		Logger.logInfo('Player created alias', { steamid, alias });
	}
}
