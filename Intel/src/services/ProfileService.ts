import Match from '../entities/Match';
import { LinqRepository } from 'typeorm-linq-repository';
import Player from '../entities/Player';
//import { ProfileViewModel } from '../../../common/ViewModels/ProfileViewModel';
import { isSteamID } from '../utils/SteamIDChecker';
import PlayerService from './PlayerService';
//import ProfilePaginatedMatchesViewModel from '../../../Common/ViewModels/ProfilePaginatedMatchesViewModel';
//import ProfileMatchViewModel from '../../../Common/ViewModels/ProfileMatchViewModel';

const playerService = new PlayerService();

const playerRepo = new LinqRepository(Player);
const matchRepo = new LinqRepository(Match);

export class ProfileService {

	async getPaginatedMatches(identifier: string, pageSize: number, currentPage: number): Promise<any> {
		let profileQuery;
		if (isSteamID(identifier)) {
			profileQuery = matchRepo
				.getAll()
				.join(m => m.players)
				.where(player => player.steamid)
				.in([identifier]);
		} else {
			profileQuery = matchRepo
				.getAll()
				.join(m => m.players)
				.where(player => player.alias)
				.equal(identifier);
		}

		const totalMatchCount = await profileQuery.count();

		const paginatedMatches = await profileQuery
			.skip(currentPage * pageSize)
			.take(Math.min(pageSize, 50));

		paginatedMatches.map(match => '');

		const profilePaginatedMatchesViewModel = {matches: [new Match()], totalMatches: 2, totalMatchCount: 1};
		profilePaginatedMatchesViewModel.matches = paginatedMatches;
		profilePaginatedMatchesViewModel.totalMatches = totalMatchCount;

		return profilePaginatedMatchesViewModel;
	}

	async getProfileBySteamid(steamid: string): Promise<any> {
		const player: Player = await playerRepo
			.getOne()
			.where(p => p.steamid)
			.equal(steamid);

		return '';
	}

	async getProfileByAlias(alias: string): Promise<any> {
		const player = await playerRepo
			.getOne()
			.where(player => player.alias)
			.equal(alias);

		return '';
	}
}