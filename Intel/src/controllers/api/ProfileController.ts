import { Get, Param, QueryParam, JsonController } from 'routing-controllers';
import { ProfileService } from '../../services/ProfileService';
import { ProfileViewModel } from '../../../../Common/ViewModels/ProfileViewModel';
import ProfilePaginatedMatchesViewModel from '../../../../Common/ViewModels/ProfilePaginatedMatchesViewModel';

const profileService = new ProfileService();
@JsonController('/profile')
export class ProfileController {

	@Get('/:steamid')
	getProfile(@Param('steamid') steamid: string): Promise<ProfileViewModel> {
		return profileService.getProfile(steamid);
	}

	@Get('/:steamid/matches')
	getPlayersMatches(
		@Param('steamid') identifier: string,
		@QueryParam('pageSize') pageSize: number,
		@QueryParam('currentPage') currentPage: number): Promise<ProfilePaginatedMatchesViewModel> {
		return profileService.getPaginatedMatches(identifier, pageSize, currentPage);
	}
}
