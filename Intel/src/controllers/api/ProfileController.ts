import { Get, Param, QueryParam, JsonController } from 'routing-controllers';
import { ProfileService } from '../../services/ProfileService';
import { ProfileViewModel } from '../../../../Common/ViewModels/ProfileViewModel';
import ProfilePaginatedMatchesViewModel from '../../../../Common/ViewModels/ProfilePaginatedMatchesViewModel';
import Region from '../../../../Common/Enums/Region';
import Gamemode from '../../../../Common/Enums/Gamemode';
import MatchType from '../../../../Common/Enums/MatchType';
import ClassStatisticsFilterOptions from '../../../../Common/Models/ClassStatisticsFilterOptions';
import ProfileClassStatisticsViewModel from '../../../../Common/ViewModels/ProfileClassStatisticsViewModel';
import ValidateClass from '../../utils/ValidateClass';
import PlayerService from '../../services/PlayerService';
import { ClassStatistics } from '../../../../Common/Models/ClassStatistics';

@JsonController('/profile')
export class ProfileController {
	private readonly playerService = new PlayerService();
	private readonly profileService = new ProfileService();

	@Get('/:identifier')
	getProfile(@Param('identifier') identifier: string): Promise<ProfileViewModel> {
		return this.profileService.getProfile(identifier);
	}

	@Get('/:identifier/matches')
	getPlayersMatches(
		@Param('identifier') identifier: string,
		@QueryParam('pageSize') pageSize: number,
		@QueryParam('currentPage') currentPage: number
	): Promise<ProfilePaginatedMatchesViewModel> {
		return this.profileService.getPaginatedMatches(identifier, pageSize, currentPage);
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
			const classStatistics = await this.playerService.getClassStatistics(identifier, filterOptions);
			return classStatistics.toProfileClassStatisticsViewModel();
		} else {
			const classStatistics = await this.playerService.getClassStatistics(identifier);
			return classStatistics.toProfileClassStatisticsViewModel();
		}
	}
}
