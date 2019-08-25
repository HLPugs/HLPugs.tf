import { JsonController, Get, Param, QueryParam } from 'routing-controllers';
import PlayerService from '../../services/PlayerService';
import Region from '../../../../Common/Enums/Region';
import Gamemode from '../../../../Common/Enums/Gamemode';
import MatchType from '../../../../Common/Enums/MatchType';
import ClassStatisticsFilterOptions from '../../../../Common/Models/ClassStatisticsFilterOptions';
import { validateSync } from 'class-validator';
import { ClassValidationError } from '../../custom-errors/ClassValidationError';


const playerService = new PlayerService();

@JsonController('/player')
export class PlayerController {

	@Get('/:steamid/classStatistics')
	getClassStatistics(
		@Param('steamid') steamid: string,
		@QueryParam('region', { required: false }) region: Region,
		@QueryParam('gamemode', { required: false }) gamemode: Gamemode,
		@QueryParam('matchType', { required: false }) matchType: MatchType) {
		if (region || gamemode || matchType) {
			const filterOptions = new ClassStatisticsFilterOptions();
			filterOptions.gamemode = gamemode;
			filterOptions.region = region;
			filterOptions.matchType = matchType;
			const errors = validateSync(filterOptions);
			if (errors.length) {
				throw new ClassValidationError(errors);
			}
			return playerService.getClassStatistics(steamid, filterOptions);
		} else {
			return playerService.getClassStatistics(steamid);
		}
	}
}
