import { Get, Param, QueryParam, JsonController } from 'routing-controllers';
import { isSteamID } from '../../utils/SteamIDChecker';
import { ProfileService } from '../../services/ProfileService';
import ProfileViewModel from '@hlpugs/common/lib/ViewModels/ProfileViewModel';
import ProfilePaginatedMatchesViewModel from '@hlpugs/common/lib/ViewModels/ProfilePaginatedMatchesViewModel';

const profileService = new ProfileService();
@JsonController('/profile')
export class PlayerController {

	@Get('/:identifier')
	getProfile(@Param('identifier') identifier: string): Promise<ProfileViewModel> {
		if (isSteamID(identifier)) {
			return profileService.getProfileBySteamid(identifier);
		} else {
			return profileService.getProfileByAlias(identifier);
		}
	}

	@Get('/:identifier/matches')
	getPlayersMatches(
		@Param('identifier') identifier: string,
		@QueryParam('pageSize') pageSize: number,
		@QueryParam('currentPage') currentPage: number): Promise<ProfilePaginatedMatchesViewModel> {
		return profileService.getPaginatedMatches(identifier, pageSize, currentPage);
	}

}
