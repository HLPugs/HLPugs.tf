
import Player from '../entities/Player';
import Punishment from '../entities/Punishment';
import { LinqRepository } from 'typeorm-linq-repository';
import PunishmentType from '@hlpugs/common/lib/Enums/PunishmentType';
import PlayerSettings from '../entities/PlayerSettings';
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
	
	async getPlayerByAlias(alias: string): Promise<Player> {
		const playerRepo = new LinqRepository(Player);
		const player = await playerRepo
			.getOne()
			.where(p => p.alias)
			.equal(alias);

		return player;
	}

	async updateSettings(alias: string, settings: PlayerSettings): Promise<void> {
		const playerRepo = new LinqRepository(Player);

		const player = await this.getPlayerByAlias(alias)
		player.settings = settings;
		await playerRepo.update(player);
	}

	async updateAlias(steamid: string, alias: string): Promise<void> {
		const playerRepo = new LinqRepository(Player);

		const player = await this.getPlayer(steamid);
		player.alias = alias;
		await playerRepo.update(player);
	}

	async getSettings(identifier: string): Promise<PlayerSettings> {
		const playerSettingsRepo = new LinqRepository(PlayerSettings);

		let playerSettingsQuery;
		if (isSteamID(identifier)) {
			playerSettingsQuery = playerSettingsRepo
				.getOne()
				.join(s => s.player)
				.where(player => player.steamid)
				.equal(identifier)
		} else {
			playerSettingsQuery = playerSettingsRepo
				.getOne()
				.join(s => s.player)
				.where(player => player.alias)
				.equal(identifier);
		}

		return await playerSettingsQuery;
	}

	async updateOrInsertPlayer(player: Player): Promise<void> {
		const playerRepo = new LinqRepository(Player);
		const playerSettingsRepo = new LinqRepository(PlayerSettings);

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
		return await punishmentRepo
			.getAll()
			.where(p => p.expirationDate)
			.greaterThan(new Date())
			.and(p => p.offenderSteamid)
			.equal(steamid);
	};

	async isCurrentlySiteBanned(steamid: string): Promise<boolean> {
		const punishments = await this.getActivePunishments(steamid)
		return punishments.some(p => p.punishmentType === PunishmentType.BAN);
	}
}