import Gamemode from '../Enums/Gamemode';
import Team from '../Enums/Team';
import Region from '../Enums/Region';
import MatchType from '../Enums/MatchType';

class ClassStatisticsFilterOptions {
	region?: Region;
	gamemode?: Gamemode;
	matchType?: MatchType;
}

export default ClassStatisticsFilterOptions;