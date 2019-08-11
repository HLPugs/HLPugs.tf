import Player from '../entities/Player';
import Match from '../entities/Match';
import Punishment from '../entities/Punishment';
import { PunishmentType } from '../enums/PunishmentType';
import { LinqRepository } from 'typeorm-linq-repository';
import { validate } from 'class-validator';

//const punishmentRepository = new LinqRepository(Punishment);

export default class PlayerService {
  
  async getPlayer(steamid: string): Promise<Player> {
    const playerRepository = new LinqRepository(Player);
    const player = await playerRepository
      .getOne()
      .where(p => p.steamid)
      .equal(steamid);

    return player;
  }

  async getPlayerByAlias(alias: string): Promise<Player> {
    const playerRepository = new LinqRepository(Player);
    const player = await playerRepository
      .getOne()
      .where(p => p.alias)
      .equal(alias);

      return player;
  }

  async updateAlias(steamid: string, alias: string): Promise<void> {
    const playerRepository = new LinqRepository(Player);
    const player = await this.getPlayer(steamid);
    player.alias = alias;
    await playerRepository.update(player);
  }

  async updateOrInsertPlayer(player: Player): Promise<void> {
    const playerRepository = new LinqRepository(Player);

    const existingPlayer = await this.getPlayer(player.steamid);

    if (existingPlayer) {
      await playerRepository.update(player);
    } else {
      await playerRepository.create(player);
    }
  }

  async getActivePunishments(steamid: string): Promise<Punishment[]> {
    const punishmentRepository = new LinqRepository(Punishment);
    return await punishmentRepository
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