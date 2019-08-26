import Gamemode from '../Enums/Gamemode';
import Region from '../Enums/Region';
import { IsOptional, IsEnum } from 'class-validator';
import MatchType from '../Enums/MatchType';

class ClassStatisticsFilterOptions {
	@IsOptional()
	@IsEnum(Region)
	region?: Region;

	@IsOptional()
	@IsEnum(Gamemode)
	gamemode?: Gamemode;

	@IsOptional()
	@IsEnum(MatchType)
	matchType?: MatchType;
}

export default ClassStatisticsFilterOptions;
