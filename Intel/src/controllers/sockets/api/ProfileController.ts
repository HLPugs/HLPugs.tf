import { Get, Param, QueryParam, JsonController } from 'routing-controllers';
import { ProfileService } from '../../../services/ProfileService';
import { ProfileViewModel } from '../../../../../Common/ViewModels/ProfileViewModel';
import ProfilePaginatedMatchesViewModel from '../../../../../Common/ViewModels/ProfilePaginatedMatchesViewModel';
import Region from '../../../../../Common/Enums/Region';
import Gamemode from '../../../../../Common/Enums/Gamemode';
import MatchType from '../../../../../Common/Enums/MatchType';
import ClassStatisticsFilterOptions from '../../../../../Common/Models/ClassStatisticsFilterOptions';
import ProfileClassStatisticsViewModel from '../../../../../Common/ViewModels/ProfileClassStatisticsViewModel';
import ValidateClass from '../../../utils/ValidateClass';
import PlayerService from '../../../services/PlayerService';

const playerService = new PlayerService();
const profileService = new ProfileService();
@JsonController('/profile')
export class ProfileController {
	@Get('/:identifier')
	getProfile(@Param('identifier') identifier: string): Promise<ProfileViewModel> {
		return profileService.getProfile(identifier);
	}

	@Get('/:identifier/matches')
	getPlayersMatches(
		@Param('identifier') identifier: string,
		@QueryParam('pageSize') pageSize: number,
		@QueryParam('currentPage') currentPage: number
	): Promise<ProfilePaginatedMatchesViewModel> {
		return profileService.getPaginatedMatches(identifier, pageSize, currentPage);
	}

	@Get('/:identifier/classStatistics')
	async getClassStatistics(
		@Param('identifier') identifier: string,
		@QueryParam('region', { required: false }) region: Region,
		@QueryParam('gamemode', { required: false }) gamemode: Gamemode,
		@QueryParam('matchType', { required: false }) matchType: MatchType
	): Promise<ProfileClassStatisticsViewModel> {
		if (region || gamemode || matchType) {
			const filterOptions: ClassStatisticsFilterOptions = {
				gamemode,
				region,
				matchType
			};
			ValidateClass(filterOptions);
			const classStatistics = await playerService.getClassStatistics(identifier, filterOptions);
			return ProfileClassStatisticsViewModel.fromClassStatistics(classStatistics);
		} else {
			const classStatistics = await playerService.getClassStatistics(identifier);
			return ProfileClassStatisticsViewModel.fromClassStatistics(classStatistics);
		}
	}
}
