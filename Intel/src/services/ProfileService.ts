import Match from '../entities/Match';
import { LinqRepository } from 'typeorm-linq-repository';
import Player from '../entities/Player';
import { ProfileViewModel } from '../../../Common/ViewModels/ProfileViewModel';
import PlayerService from './PlayerService';
import ProfilePaginatedMatchesViewModel from '../../../Common/ViewModels/ProfilePaginatedMatchesViewModel';
import ProfileMatchViewModel from '../../../Common/ViewModels/ProfileMatchViewModel';
import { isSteamID } from '../utils/SteamIDChecker';
import SteamID from '../../../Common/Types/SteamID';
import { playerService } from '.';

const matchRepository = new LinqRepository(Match);

export default class ProfileService {
	async getPaginatedMatches(
		identifier: string,
		pageSize: number,
		currentPage: number
	): Promise<ProfilePaginatedMatchesViewModel> {
		let profileQuery;
		if (isSteamID(identifier)) {
			profileQuery = matchRepository
				.getAll()
				.join(m => m.players)
				.where(player => player.steamid)
				.in([identifier]);
		} else {
			profileQuery = matchRepository
				.getAll()
				.join(m => m.players)
				.where(player => player.alias)
				.equal(identifier);
		}

		const totalMatchCount = await profileQuery.count();

		const paginatedMatches = await profileQuery
			.include(m => m.matchPlayerData)
			.skip(currentPage * pageSize)
			.take(Math.min(pageSize, 50));

		const paginatedMatchesViewModel = paginatedMatches.map(match => ProfileMatchViewModel.fromMatch(match));

		const profilePaginatedMatchesViewModel = new ProfilePaginatedMatchesViewModel();
		profilePaginatedMatchesViewModel.matches = paginatedMatchesViewModel;
		profilePaginatedMatchesViewModel.totalMatches = totalMatchCount;

		return profilePaginatedMatchesViewModel;
	}

	async getProfile(steamid: SteamID): Promise<ProfileViewModel> {
		const player = await playerService.getPlayer(steamid);
		const profileViewModel = ProfileViewModel.fromPlayer(player);

		return profileViewModel;
	}
}
