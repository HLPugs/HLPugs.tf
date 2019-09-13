import Region from '../Enums/Region'
import Gamemode from '../Enums/Gamemode'
import MatchType from '../Enums/MatchType'

class EnvironmentConfigModel {
	region!: Exclude<Region, Region.All>;
	gamemode!: Gamemode;
	matchType!: MatchType;
}

export default EnvironmentConfigModel;