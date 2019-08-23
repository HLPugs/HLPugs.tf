import Gamemode from '../Enums/Gamemode';
import Team from '../Enums/Team';
import Region from '../Enums/Region';
import DraftTFClass from '../Enums/DraftTFClass'
import MatchType from '../Enums/MatchType';

class ClassStatisticsFilterOptions {
	team?: Team;
	region?: Region;
	tf2class?: DraftTFClass | DraftTFClass[];
	gamemode?: Gamemode;
	matchType?: MatchType;
}

export default ClassStatisticsFilterOptions;