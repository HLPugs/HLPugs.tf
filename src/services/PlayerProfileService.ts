import { Player } from '../entities/Player';
import { LinqRepository, ILinqRepository } from 'typeorm-linq-repository';

export class PlayerProfileService {
	private readonly _playerRepository: ILinqRepository<Player>;

	async getMatchesForProfile(steamid: string, pageSize: number, currentPage: number) {
		const startIndex = (pageSize - 1) * currentPage;
		const endIndex = startIndex + pageSize;
	}

	async getPlayerBySteamid(steamid: string): Promise<Player> {
		const player = await this._playerRepository
		.getOne()
		.where(p => p.steamid)
		.equal(steamid);

		return player;
	}
}