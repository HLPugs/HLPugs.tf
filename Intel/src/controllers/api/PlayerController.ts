import { JsonController, Get, Param, QueryParam } from 'routing-controllers';
import PlayerService from '../../services/PlayerService';
import Region from '../../../../Common/Enums/Region';
import Gamemode from '../../../../Common/Enums/Gamemode';
import MatchType from '../../../../Common/Enums/MatchType';
import ClassStatisticsFilterOptions from '../../../../Common/Models/ClassStatisticsFilterOptions';
import ValidateClass from '../../utils/ValidateClass';
import SteamID from '../../../../Common/Types/SteamID';

@JsonController('/player')
export class PlayerController {
	private readonly playerService = new PlayerService();
	
	@Get('/:steamid/classStatistics')
	getClassStatistics(
		@Param('steamid') steamid: SteamID,
		@QueryParam('region', { required: false }) region: Region,
		@QueryParam('gamemode', { required: false }) gamemode: Gamemode,
		@QueryParam('matchType', { required: false }) matchType: MatchType
	) {
		if (region || gamemode || matchType) {
			const filterOptions = new ClassStatisticsFilterOptions();
			filterOptions.gamemode = gamemode;
			filterOptions.region = region;
			filterOptions.matchType = matchType;
			ValidateClass(filterOptions);
			return this.playerService.getClassStatistics(steamid, filterOptions);
		} else {
			return this.playerService.getClassStatistics(steamid);
		}
	}
}
