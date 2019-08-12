import { Get, Param, QueryParam, JsonController } from 'routing-controllers';
import Match from '../../entities/Match';
import { isSteamID } from '../../utils/SteamIDChecker';
import PlayerProfile from '../../viewmodels/Profile';
import { ProfileService } from '../../services/ProfileService';

@JsonController('/profile')
export default class PlayerController {

  private profileService: ProfileService = new ProfileService();

  @Get('/:identifier')
  async getProfile(@Param('identifier') identifier: string): Promise<PlayerProfile> {
    if (isSteamID(identifier)) {
      return await this.profileService.getProfileBySteamid(identifier);
    } else {
      return await this.profileService.getProfileByAlias(identifier);
    }
  }

  @Get('/:identifier/matches')
  async getPlayersMatches(
    @Param('steamid') steamid: string,
      @QueryParam('pageSize') pageSize: number,
        @QueryParam('currentPage') currentPage: number): Promise<Match[]> {
    const matches = await this.profileService.getPaginatedMatches(steamid, pageSize, currentPage);
    return matches;
  }

  @Get('/test/time')
  async testTime() {
    
  } 
}
