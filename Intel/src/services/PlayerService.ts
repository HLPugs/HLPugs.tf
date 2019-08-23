
import Player from '../entities/Player';
import Punishment from '../entities/Punishment';
import { LinqRepository } from 'typeorm-linq-repository';
import PunishmentType from '../../../Common/Enums/PunishmentType';
import PlayerSettings from '../entities/PlayerSettings';
import Team from '../../../Common/Enums/Team';
import ClassStatisticsFilterOptions from '../../../Common/Models/ClassStatisticsFilterOptions';
import ClassStatistics from '../../../common/Models/ClassStatistics';
import { isSteamID } from '../utils/SteamIDChecker';
export default class PlayerService {

	async getPlayer(steamid: string): Promise<Player> {
		const playerRepo = new LinqRepository(Player);
		const player = await playerRepo
			.getOne()
			.where(p => p.steamid)
			.equal(steamid);

		return player;
	}

	async getClassStatistics(steamid: string, filterOptions?: ClassStatisticsFilterOptions): Promise<ClassStatistics> {
		const playerRepo = new LinqRepository(Player);

		let classStatisticsQuery = playerRepo
			.getOne()
			.where(player => player.steamid)
			.equal(steamid)
			.include(p => p.matches)
			.thenInclude(m => m.matchPlayerData)
			.join(m => m.matchPlayerData)
			.where(mpd => mpd.player.steamid)
			.equal(steamid)

		let classStatisticsQueryWithFilters;
		if (filterOptions) {
			classStatisticsQueryWithFilters = classStatisticsQuery;

			if (filterOptions.team) {
				classStatisticsQueryWithFilters = classStatisticsQueryWithFilters
					.and(mpd => mpd.team)
					.equal(filterOptions.team);
			}

			if (filterOptions.tf2class) {
				classStatisticsQueryWithFilters = classStatisticsQueryWithFilters
					.and(mpd => mpd.tf2class)
					.in([...filterOptions.tf2class]);
			}

			if (filterOptions.gamemode || filterOptions.matchType || filterOptions.region) {
				classStatisticsQueryWithFilters = classStatisticsQueryWithFilters
					.join(player => player.matches)

				if (filterOptions.gamemode) {
					classStatisticsQueryWithFilters = classStatisticsQueryWithFilters
						.where(match => match.gamemode)
						.equal(filterOptions.gamemode);
				}

				if (filterOptions.region) {
					classStatisticsQueryWithFilters = classStatisticsQueryWithFilters
						.and(match => match.region)
						.equal(filterOptions.region);
				}

				if (filterOptions.matchType) {
					classStatisticsQueryWithFilters = classStatisticsQueryWithFilters
						.and(match => match.matchType)
						.equal(filterOptions.matchType);
				}
			}
		}

		const player = await classStatisticsQuery;
		const classStatistics = new ClassStatistics();

		player.matches.forEach(match => {
			const matchPlayerData = match.matchPlayerData[0];
			if (match.winningTeam === matchPlayerData.team) {
				classStatistics.winsByClass[matchPlayerData.tf2class]++;
				classStatistics.totalWins++;
			} else if (match.winningTeam === Team.NONE) {
				classStatistics.tiesByClass[matchPlayerData.tf2class]++;
				classStatistics.totalTies++;
			} else {
				classStatistics.lossesByClass[matchPlayerData.tf2class]++;
				classStatistics.totalLosses++;
			}
		});

		return classStatistics;
	}

	async updateSettings(steamid: string, settings: PlayerSettings): Promise<void> {
		const playerRepo = new LinqRepository(Player);

		const player = await this.getPlayer(steamid)
		player.settings = settings;
		await playerRepo.update(player);
	}

	async updateAlias(steamid: string, alias: string): Promise<void> {
		const playerRepo = new LinqRepository(Player);

		const player = await this.getPlayer(steamid);
		player.alias = alias;
		await playerRepo.update(player);
	}

	async getSettings(steamid: string): Promise<PlayerSettings> {
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