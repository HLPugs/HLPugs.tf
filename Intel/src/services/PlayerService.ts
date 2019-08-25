
import Player from '../entities/Player';
import Punishment from '../entities/Punishment';
import { LinqRepository } from 'typeorm-linq-repository';
import PunishmentType from '../../../Common/Enums/PunishmentType';
import PlayerSettings from '../entities/PlayerSettings';
import Team from '../../../Common/Enums/Team';
import ClassStatisticsFilterOptions from '../../../Common/Models/ClassStatisticsFilterOptions';
import ClassStatistics from '../../../Common/Models/ClassStatistics';
import { isSteamID } from '../utils/SteamIDChecker';
import { getManager } from 'typeorm';
import Gamemode from '../../../Common/Enums/Gamemode';
import Region from '../../../Common/Enums/Region';
import MatchType from '../../../Common/Enums/MatchType';
import DraftTFClass from '../../../Common/Enums/DraftTFClass';
import { PlayerNotFoundError } from '../custom-errors/PlayerNotFoundError';
export default class PlayerService {

	async getPlayer(steamid: string): Promise<Player> {
		const playerRepo = new LinqRepository(Player);

		const player = await playerRepo
			.getOne()
			.where(p => p.steamid)
			.equal(steamid);
		if (player === undefined) {
			throw new PlayerNotFoundError(steamid);
		}
		return player;
	}

	async getClassStatistics(steamid: string, filterOptions?: ClassStatisticsFilterOptions): Promise<ClassStatistics> {
		let filterQuery = '';
		const filters: (MatchType | Region | Gamemode)[] = [];
		if (filterOptions) {
			if (filterOptions.gamemode) {
				filterQuery += ' AND m.gamemode = ?';
				filters.push(filterOptions.gamemode)
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
		const db = await getManager();
		if (!(await this.playerExists(steamid))) {
			throw new PlayerNotFoundError(steamid);
		}
		// tslint:disable-next-line: max-line-length
		const winsQuery = db.query(`SELECT tf2class, COUNT(1) as count FROM matches m INNER JOIN match_player_data mpd WHERE mpd.playerSteamid = ? AND mpd.team = m.winningTeam AND m.id = mpd.matchId ${filterQuery} GROUP BY tf2class`, [steamid, ...filters]);
		// tslint:disable-next-line: max-line-length
		const lossQuery = db.query(`SELECT tf2class, COUNT(1) as count FROM matches m INNER JOIN match_player_data mpd WHERE mpd.playerSteamid = ? AND mpd.team != m.winningTeam AND mpd.team != '${Team.NONE}' AND m.id = mpd.matchId ${filterQuery} GROUP BY tf2class`, [steamid, ...filters]);
		// tslint:disable-next-line: max-line-length
		const tiesQuery = db.query(`SELECT tf2class, COUNT(1) as count FROM matches m INNER JOIN match_player_data mpd WHERE mpd.playerSteamid = ? AND mpd.team != m.winningTeam AND m.id = mpd.matchId ${filterQuery} GROUP BY tf2class`, [steamid, ...filters]);

		const winResults = await winsQuery;
		const lossResults = await lossQuery;
		const tieResults = await tiesQuery;

		const classStatistics = new ClassStatistics();

		winResults.forEach((classStatistic: any) => {
			classStatistics.winsByClass[classStatistic.tf2class as DraftTFClass] = classStatistic.count;
		});

		lossResults.forEach((classStatistic: any) => {
			classStatistics.lossesByClass[classStatistic.tf2class as DraftTFClass] = classStatistic.count;
		});

		tieResults.forEach((classStatistic: any) => {
			classStatistics.tiesByClass[classStatistic.tf2class as DraftTFClass] = classStatistic.count;
		});

		return classStatistics;
	}

	async updateSettings(steamid: string, settings: PlayerSettings): Promise<void> {
		if (!(await this.playerExists(steamid))) {
			throw new PlayerNotFoundError(steamid);
		}

		const playerRepo = new LinqRepository(Player);

		const player = await this.getPlayer(steamid)
		player.settings = settings;
		await playerRepo.update(player);
	}

	async updateAlias(steamid: string, alias: string): Promise<void> {
		if (!(await this.playerExists(steamid))) {
			throw new PlayerNotFoundError(steamid);
		}
		const playerRepo = new LinqRepository(Player);

		const player = await this.getPlayer(steamid);
		player.alias = alias;
		await playerRepo.update(player);
	}

	async getSettings(steamid: string): Promise<PlayerSettings> {
		if (!(await this.playerExists(steamid))) {
			throw new PlayerNotFoundError(steamid);
		}

		const playerSettingsRepo = new LinqRepository(PlayerSettings);

		const settings = await playerSettingsRepo
			.getOne()
			.join(s => s.player)
			.where(player => player.steamid)
			.equal(steamid)

		return settings;
	}

	async updateOrInsertPlayer(player: Player): Promise<void> {
		const playerRepo = new LinqRepository(Player);

		const existingPlayer = await this.getPlayer(player.steamid);
		if (existingPlayer) {
			await playerRepo.update(player);
		} else {
			player.settings = new PlayerSettings();
			await playerRepo.create(player);
		}
	}

	async getActivePunishments(steamid: string): Promise<Punishment[]> {
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
	};

	async isCurrentlySiteBanned(steamid: string): Promise<boolean> {
		if (!(await this.playerExists(steamid))) {
			throw new PlayerNotFoundError(steamid);
		}
		const punishments = await this.getActivePunishments(steamid)
		return punishments.some(p => p.punishmentType === PunishmentType.BAN);
	}

	async playerExists(identifier: string): Promise<boolean> {
		const playerRepo = new LinqRepository(Player);
		if (isSteamID(identifier)) {
			return await playerRepo
				.getOne()
				.where(p => p.steamid)
				.equal(identifier)
				.count() > 0;
		} else {
			return await playerRepo
				.getOne()
				.where(p => p.alias)
				.equal(identifier)
				.count() > 0;
		}
	}
}