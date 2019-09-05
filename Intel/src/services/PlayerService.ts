import Player from '../entities/Player';
import Punishment from '../entities/Punishment';
import { LinqRepository } from 'typeorm-linq-repository';
import PunishmentType from '../../../Common/Enums/PunishmentType';
import PlayerSettings from '../entities/PlayerSettings';
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
export default class PlayerService {
	async getPlayer(identifier: string): Promise<Player> {
		const playerRepo = new LinqRepository(Player);
		let player: Player;
		if (isSteamID(identifier)) {
			player = await playerRepo
				.getOne()
				.where(p => p.steamid)
				.equal(identifier);
		} else {
			player = await playerRepo
				.getOne()
				.where(p => p.alias)
				.equal(identifier);
		}
		if (player === undefined) {
			throw new PlayerNotFoundError(identifier);
		}
		return player;
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
		const db = await getManager();
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

		const playerRepo = new LinqRepository(Player);

		const player = await this.getPlayer(steamid);
		player.settings = settings;
		await playerRepo.update(player);
	}

	async updateAlias(steamid: SteamID, alias: string): Promise<void> {
		if (!(await this.playerExists(steamid))) {
			throw new PlayerNotFoundError(steamid);
		}
		const playerRepo = new LinqRepository(Player);

		const player = await this.getPlayer(steamid);
		player.alias = alias;
		await playerRepo.update(player);
	}

	async getSettings(steamid: SteamID): Promise<PlayerSettings> {
		if (!(await this.playerExists(steamid))) {
			throw new PlayerNotFoundError(steamid);
		}

		const playerSettingsRepo = new LinqRepository(PlayerSettings);

		const settings = await playerSettingsRepo
			.getOne()
			.join(s => s.player)
			.where(player => player.steamid)
			.equal(steamid);

		return settings;
	}

	async updateOrInsertPlayer(player: Player): Promise<void> {
		const playerRepo = new LinqRepository(Player);

		const existingPlayer = await this.playerExists(player.steamid);
		if (existingPlayer) {
			await playerRepo.update(player);
		} else {
			player.settings = new PlayerSettings();
			await playerRepo.create(player);
		}
	}

	async getActivePunishments(steamid: SteamID): Promise<Punishment[]> {
		if (!(await this.playerExists(steamid))) {
			throw new PlayerNotFoundError(steamid);
		}

		const punishmentRepo = new LinqRepository(Punishment);
		const activePunishments = await punishmentRepo
			.getAll()
			.where(p => p.expirationDate)
			.greaterThan(new Date())
			.and(p => p.offenderSteamid)
			.equal(steamid);

		return activePunishments;
	}

	async isCurrentlySiteBanned(steamid: SteamID): Promise<boolean> {
		if (!(await this.playerExists(steamid))) {
			throw new PlayerNotFoundError(steamid);
		}
		const punishments = await this.getActivePunishments(steamid);
		return punishments.some(p => p.punishmentType === PunishmentType.BAN);
	}

	async playerExists(identifier: string): Promise<boolean> {
		const playerRepo = new LinqRepository(Player);
		if (isSteamID(identifier)) {
			return (
				(await playerRepo
					.getOne()
					.where(p => p.steamid)
					.equal(identifier)
					.count()) > 0
			);
		} else {
			return (
				(await playerRepo
					.getOne()
					.where(p => p.alias)
					.equal(identifier)
					.count()) > 0
			);
		}
	}
}
