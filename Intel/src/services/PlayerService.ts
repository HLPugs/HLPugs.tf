import PunishmentEntity from '../entities/PunishmentEntity';
import { LinqRepository } from 'typeorm-linq-repository';
import PunishmentType from '../../../Common/Enums/PunishmentType';
import PlayerSettingsEntity from '../entities/PlayerSettingsEntity';
import Team from '../../../Common/Enums/Team';
import ClassStatisticsFilterOptions from '../../../Common/Models/ClassStatisticsFilterOptions';
import { isSteamID } from '../utils/SteamIDChecker';
import { getManager } from 'typeorm';
import Gamemode from '../../../Common/Enums/Gamemode';
import Region from '../../../Common/Enums/Region';
import MatchType from '../../../Common/Enums/MatchType';
import PlayerNotFoundError from '../custom-errors/PlayerNotFoundError';
import { ClassStatistics, ClassStatistic } from '../../../Common/Models/ClassStatistics';
import GamemodeClassSchemes from '../../../Common/Constants/GamemodeClassSchemes';
import ClassStatisticQueryResult from '../interfaces/ClassStatisticQueryResult';
import GetAllDraftTFClasses from '../utils/GetAllDraftTFClasses';
import SteamID from '../../../Common/Types/SteamID';
import SessionService from './SessionService';
import ValidateClass from '../utils/ValidateClass';
import Role from '../../../Common/Enums/Role';
import PermissionGroup from '../../../Common/Enums/PermissionGroup';
import Punishment from '../../../Common/Models/Punishment';
import Player from '../../../Common/Models/Player';
import PlayerSettings from '../../../Common/Models/PlayerSettings';
import UnnamedPlayer from '../interfaces/UnnamedPlayer';
import PlayerEntity from '../entities/PlayerEntity';

export default class PlayerService {
	private readonly sessionService = new SessionService();

	async getPlayer(steamid: SteamID): Promise<Player> {
		const player = await this.sessionService.getPlayer(steamid);
		if (player !== undefined) {
			return ValidateClass(player);
		} else {
			const playerRepository = new LinqRepository(PlayerEntity);
			const playerEntity = await playerRepository
				.getOne()
				.where(p => p.steamid)
				.equal(steamid)
				.include(p => p.settings);
			if (playerEntity === undefined) {
				throw new PlayerNotFoundError(steamid);
			}
			const player = PlayerEntity.toPlayer(playerEntity);
			return ValidateClass(player);
		}
	}

	async getPlayersByPartialAlias(alias: string): Promise<Player[]> {
		const playerRepository = new LinqRepository(PlayerEntity);
		const players = await playerRepository
			.getAll()
			.where(p => p.alias)
			.beginsWith(alias);

		return players.map(p => PlayerEntity.toPlayer(p));
	}

	async getClassStatistics(identifier: string, filterOptions?: ClassStatisticsFilterOptions): Promise<ClassStatistics> {
		let filterQuery = '';
		const filters: (MatchType | Region | Gamemode)[] = [];
		if (filterOptions) {
			if (filterOptions.gamemode) {
				filterQuery += ' AND m.gamemode = ?';
				filters.push(filterOptions.gamemode);
			}

			if (filterOptions.matchType) {
				filterQuery += ' AND m.matchtype = ?';
				filters.push(filterOptions.matchType);
			}

			if (filterOptions.region) {
				filterQuery += ' AND m.region = ?';
				filters.push(filterOptions.region);
			}
		}

		let steamid: SteamID;
		if (!(await this.playerExists(identifier))) {
			throw new PlayerNotFoundError(identifier);
		} else {
			steamid = isSteamID(identifier) ? identifier : (await this.getPlayer(identifier)).steamid;
		}
		const db = getManager();
		const winsQuery = db.query(
			`SELECT tf2class, COUNT(1) as count FROM matches m INNER JOIN match_player_data mpd WHERE mpd.playerSteamid = ? AND mpd.team = m.winningTeam AND m.id = mpd.matchId ${filterQuery} GROUP BY tf2class`,
			[steamid, ...filters]
		);
		const lossQuery = db.query(
			`SELECT tf2class, COUNT(1) as count FROM matches m INNER JOIN match_player_data mpd WHERE mpd.playerSteamid = ? AND mpd.team != m.winningTeam AND m.winningTeam != '${Team.NONE}' AND m.id = mpd.matchId ${filterQuery} GROUP BY tf2class`,
			[steamid, ...filters]
		);
		const tiesQuery = db.query(
			`SELECT tf2class, COUNT(1) as count FROM matches m INNER JOIN match_player_data mpd WHERE mpd.playerSteamid = ? AND m.winningTeam = '${Team.NONE}' AND m.id = mpd.matchId ${filterQuery} GROUP BY tf2class`,
			[steamid, ...filters]
		);

		const winResults: ClassStatisticQueryResult[] = await winsQuery;
		const lossResults: ClassStatisticQueryResult[] = await lossQuery;
		const tieResults: ClassStatisticQueryResult[] = await tiesQuery;

		const tf2classes =
			filterOptions && filterOptions.gamemode
				? GamemodeClassSchemes.get(filterOptions.gamemode).map(scheme => scheme.tf2class)
				: GetAllDraftTFClasses();

		const classStatistics = new ClassStatistics();
		tf2classes.forEach(tf2class => {
			classStatistics.statistics.set(tf2class, new ClassStatistic());
		});

		let totalWinCount = 0,
			totalLossCount = 0,
			totalTieCount = 0;
		winResults.forEach(result => {
			classStatistics.statistics.get(result.tf2class).wins = result.count;
			totalWinCount += result.count;
		});

		tieResults.forEach(result => {
			classStatistics.statistics.get(result.tf2class).ties = result.count;
			totalTieCount += result.count;
		});

		lossResults.forEach(result => {
			classStatistics.statistics.get(result.tf2class).losses = result.count;
			totalLossCount += result.count;
		});

		classStatistics.totalWinCount = totalWinCount;
		classStatistics.totalTieCount = totalTieCount;
		classStatistics.totalLossCount = totalLossCount;

		return classStatistics;
	}

	async updateSettings(steamid: SteamID, settings: PlayerSettings): Promise<void> {
		if (!(await this.playerExists(steamid))) {
			throw new PlayerNotFoundError(steamid);
		}

		const playerRepository = new LinqRepository(PlayerEntity);

		const player = await playerRepository
			.getOne()
			.where(p => p.steamid)
			.equal(steamid)
			.include(p => p.settings);

		const playerSettingsEntity = await PlayerSettingsEntity.fromPlayerSettings(
			player.settings.id,
			player.steamid,
			settings
		);

		const settingsId = player.settings.id;
		player.settings = playerSettingsEntity;
		player.settings.id = settingsId;
		await playerRepository.update(player);
	}

	async updateAlias(steamid: SteamID, alias: string): Promise<Player> {
		if (!(await this.playerExists(steamid))) {
			throw new PlayerNotFoundError(steamid);
		}
		const playerRepository = new LinqRepository(PlayerEntity);

		const playerEntity = await PlayerEntity.getBySteamID(steamid);
		playerEntity.alias = alias;

		const updatedPlayerEntity = await playerRepository.update(playerEntity);
		const player = PlayerEntity.toPlayer(playerEntity);
		await this.sessionService.updatePlayer(player);
		return PlayerEntity.toPlayer(updatedPlayerEntity);
	}

	async isAliasTaken(alias: string) {
		const playerRepository = new LinqRepository(PlayerEntity);
		return (
			(await playerRepository
				.getOne()
				.where(p => p.alias)
				.equal(alias)
				.count()) > 0
		);
	}

	async getSettings(steamid: SteamID): Promise<PlayerSettings> {
		if (!(await this.playerExists(steamid))) {
			throw new PlayerNotFoundError(steamid);
		}

		const playerSettingsRepository = new LinqRepository(PlayerSettingsEntity);

		const settingsEntity = await playerSettingsRepository
			.getOne()
			.join(s => s.player)
			.where(player => player.steamid)
			.equal(steamid);

		return PlayerSettingsEntity.toPlayerSettings(settingsEntity);
	}

	async loginNewPlayer(player: UnnamedPlayer): Promise<void> {
		const playerRepository = new LinqRepository(PlayerEntity);

		await this.sessionService.updatePlayer(player);
		const playerEntity = PlayerEntity.createNewPlayer(player);
		await playerRepository.create(playerEntity);
	}

	async loginExistingPlayer(player: Player): Promise<void> {
		if (await this.playerExists(player.steamid)) {
			const playerRepository = new LinqRepository(PlayerEntity);
			let playerToUpdate = await playerRepository
				.getOne()
				.where(x => x.steamid)
				.equal(player.steamid);
			playerToUpdate.avatarUrl = player.avatarUrl;
			playerToUpdate.ip = player.ip;
			await this.sessionService.updatePlayer(playerToUpdate);
			await playerRepository.update(playerToUpdate);
		} else {
			throw new PlayerNotFoundError(player.steamid);
		}
	}

	async getActivePunishments(steamid: SteamID): Promise<Punishment[]> {
		if (!(await this.playerExists(steamid))) {
			throw new PlayerNotFoundError(steamid);
		}

		const punishmentRepository = new LinqRepository(PunishmentEntity);
		const activePunishments = await punishmentRepository
			.getAll()
			.where(p => p.expirationDate)
			.greaterThan(new Date())
			.include(p => p.author)
			.include(p => p.offender);

		return activePunishments.filter(p => p.offender.steamid === steamid).map(p => PunishmentEntity.toPunishment(p));
	}

	async isCurrentlyMutedInChat(steamid: SteamID): Promise<boolean> {
		const activePunishments = await this.getActivePunishments(steamid);
		const isCurrentlyMutedInChat = activePunishments.some(x => x.punishmentType === PunishmentType.CHAT_MUTE);
		return isCurrentlyMutedInChat;
	}

	async updateRoles(steamid: SteamID, roles: Role[]): Promise<Player> {
		if (!(await this.playerExists(steamid))) {
			throw new PlayerNotFoundError(steamid);
		}
		const playerRepository = new LinqRepository(PlayerEntity);
		const playerEntity = await PlayerEntity.getBySteamID(steamid);
		playerEntity.roles = roles;
		const updatedPlayer = await playerRepository.update(playerEntity);
		await this.sessionService.updatePlayer(updatedPlayer);
		return PlayerEntity.toPlayer(updatedPlayer);
	}

	async updatePermissionGroup(steamid: SteamID, permissionGroup: PermissionGroup): Promise<PlayerEntity> {
		if (!(await this.playerExists(steamid))) {
			throw new PlayerNotFoundError(steamid);
		}
		const playerRepository = new LinqRepository(PlayerEntity);
		const playerEntity = await PlayerEntity.getBySteamID(steamid);
		playerEntity.permissionGroup = permissionGroup;
		const updatedPlayer = await playerRepository.update(playerEntity);
		await this.sessionService.updatePlayer(updatedPlayer);
		return updatedPlayer;
	}

	async isCurrentlySiteBanned(steamid: SteamID): Promise<boolean> {
		if (!(await this.playerExists(steamid))) {
			throw new PlayerNotFoundError(steamid);
		}
		const punishments = await this.getActivePunishments(steamid);
		return punishments.some(p => p.punishmentType === PunishmentType.BAN);
	}

	async playerExists(steamid: string): Promise<boolean> {
		if (this.sessionService.playerExists(steamid)) {
			return true;
		}

		const playerRepository = new LinqRepository(PlayerEntity);
		const playerExists =
			(await playerRepository
				.getOne()
				.where(p => p.steamid)
				.equal(steamid)
				.count()) > 0;
		return playerExists;
	}
}
