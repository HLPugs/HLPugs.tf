import Match from '../entities/Match';
import { LinqRepository } from 'typeorm-linq-repository';
import Player from '../entities/Player';
import { ProfileViewModel } from '../../../Common/ViewModels/ProfileViewModel';
import { isSteamID } from '../utils/SteamIDChecker';
import PlayerService from './PlayerService';
import ProfilePaginatedMatchesViewModel from '../../../Common/ViewModels/ProfilePaginatedMatchesViewModel';
import ProfileMatchViewModel from '../../../Common/ViewModels/ProfileMatchViewModel';
import Team from '../../../Common/Enums/Team';

const playerService = new PlayerService();

const playerRepo = new LinqRepository(Player);
const matchRepo = new LinqRepository(Match);

export class ProfileService {
	async getPaginatedMatches(
		steamid: string,
		pageSize: number,
		currentPage: number
	): Promise<ProfilePaginatedMatchesViewModel> {
		const profileQuery = matchRepo
			.getAll()
			.join(m => m.players)
			.where(player => player.steamid)
			.in([steamid]);

		const totalMatchCount = await profileQuery.count();

		const paginatedMatches = await profileQuery
			.include(m => m.matchPlayerData)
			.skip(currentPage * pageSize)
			.take(Math.min(pageSize, 50));

		const paginatedMatchesViewModel = paginatedMatches.map(match =>
			ProfileMatchViewModel.fromMatch(match)
		);

		const profilePaginatedMatchesViewModel = new ProfilePaginatedMatchesViewModel();
		profilePaginatedMatchesViewModel.matches = paginatedMatchesViewModel;
		profilePaginatedMatchesViewModel.totalMatches = totalMatchCount;

		return profilePaginatedMatchesViewModel;
	}

	async getProfile(steamid: string): Promise<ProfileViewModel> {
		const player = await playerService.getPlayer(steamid);
		const profileViewModel = ProfileViewModel.fromPlayer(player);

		return profileViewModel;
	}
}
