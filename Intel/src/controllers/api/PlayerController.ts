import { JsonController, Get, Param, QueryParam } from 'routing-controllers';
import PlayerService from '../../services/PlayerService';
import Region from '../../../../Common/Enums/Region';
import Team from '../../../../Common/Enums/Team';
import Gamemode from '../../../../Common/Enums/Gamemode';
import MatchType from '../../../../Common/Enums/MatchType';
import ClassStatisticsFilterOptions from '../../../../Common/Models/ClassStatisticsFilterOptions';

const playerService = new PlayerService();

@JsonController('/player')
export class PlayerController {

	@Get('/:steamid/classStatistics')
	getClassStatistics(
		@Param('steamid') steamid: string,
		@QueryParam('region', { required: false }) region: Region,
		@QueryParam('team', { required: false }) team: Team,
		@QueryParam('gamemode', { required: false }) gamemode: Gamemode,
		@QueryParam('matchType', { required: false }) matchType: MatchType,
		@QueryParam('tf2classes', { required: false }) tf2classes: string) {
		const tf2classesArr = tf2classes ? tf2classes.split(',') : undefined;
		if (region || team || gamemode || matchType || tf2classes) {
			const filterOptions = new ClassStatisticsFilterOptions();
			return playerService.getClassStatistics(steamid, filterOptions);
		} else {
			return playerService.getClassStatistics(steamid);
		}
	}
}