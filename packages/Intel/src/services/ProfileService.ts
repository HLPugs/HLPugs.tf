import Match from '../entities/Match';
import { LinqRepository } from 'typeorm-linq-repository';
import Player from '../entities/Player';
import ProfileViewModel from '@hlpugs/common/lib/ViewModels/ProfileViewModel';
import { isSteamID } from '../utils/SteamIDChecker';
import PlayerService from './PlayerService';
import ProfilePaginatedMatchesViewModel from '@hlpugs/common/lib/ViewModels/ProfilePaginatedMatchesViewModel';
import ProfileMatchViewModel from '@hlpugs/common/lib/ViewModels/ProfileMatchViewModel';

const playerService = new PlayerService();

const playerRepo = new LinqRepository(Player);
const matchRepo = new LinqRepository(Match);

export class ProfileService {

	async getPaginatedMatches(identifier: string, pageSize: number, currentPage: number): Promise<ProfilePaginatedMatchesViewModel> {
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

		paginatedMatches.map(match => ProfileMatchViewModel.fromMatch(match));

		const profilePaginatedMatchesViewModel = new ProfilePaginatedMatchesViewModel();
		profilePaginatedMatchesViewModel.matches = paginatedMatches;
		profilePaginatedMatchesViewModel.totalMatches = totalMatchCount;

		return profilePaginatedMatchesViewModel;
	}

	async getProfileBySteamid(steamid: string): Promise<ProfileViewModel> {
		const player: Player = await playerRepo
			.getOne()
			.where(p => p.steamid)
			.equal(steamid);

		return ProfileViewModel.fromPlayer(player);
	}

	async getProfileByAlias(alias: string): Promise<ProfileViewModel> {
		const player = await playerRepo
			.getOne()
			.where(player => player.alias)
			.equal(alias);

		return ProfileViewModel.fromPlayer(player);
	}
}