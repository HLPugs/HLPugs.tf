import ProfileViewModel from '../viewmodels/Profile';
import Match from '../entities/Match';
import { LinqRepository } from 'typeorm-linq-repository';
import Player from '../entities/Player';

const playerRepository = new LinqRepository(Player);

export class ProfileService {

	async getPaginatedMatches(steamid: string, pageSize: number, currentPage: number): Promise<Match[]> {
		const startIndex = (pageSize - 1) * currentPage;
		const endIndex = startIndex + pageSize;
		return [new Match()];
	}

	async getProfileBySteamid(steamid: string): Promise<ProfileViewModel> {
		const player = await playerRepository
			.getOne()
			.where(player => player.steamid)
			.equal(steamid);

		const profile = new ProfileViewModel();
		Object.assign(player, profile);
		return profile;
	}

	async getProfileByAlias(alias: string): Promise<ProfileViewModel> {
		const player = await playerRepository
			.getOne()
			.where(player => player.alias)
			.equal(alias);

		const profile = new ProfileViewModel()
		// Object.assign(player, profile);
		console.log(profile);

		return profile;
	}
}