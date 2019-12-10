import MatchEntity from '../../Intel/src/entities/MatchEntity';
import MatchType from '../Enums/MatchType';
import Team from '../Enums/Team';
import DraftTFClass from '../Enums/DraftTFClass';
import Outcome from '../Enums/Outcome';
import { IsBoolean, IsOptional, IsDate, IsString, IsEnum, IsNumber } from 'class-validator';
import Validate from '../../Intel/src/utils/ValidateClass';

export default class ProfileMatchViewModel {
	@IsNumber()
	id: number;

	@IsEnum(MatchType)
	matchType: MatchType;

	@IsString()
	map: string;

	@IsEnum(Outcome)
	outcome: Outcome;

	@IsDate()
	date: Date;

	@IsOptional()
	@IsNumber()
	logsId?: number | null;

	@IsEnum(Team)
	team: Team;

	@IsBoolean()
	wasCaptain: boolean;

	@IsEnum(DraftTFClass)
	tf2class: DraftTFClass;
}
