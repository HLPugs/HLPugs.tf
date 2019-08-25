import Match from '../../Intel/src/entities/Match';
import MatchType from '../Enums/MatchType';
import Team from '../Enums/Team';
import DraftTFClass from '../Enums/DraftTFClass';
import Outcome from '../Enums/Outcome';
import { IsBoolean, IsOptional, IsDate, IsString, IsEnum, validateSync, IsNumber } from 'class-validator'
import { ClassValidationError } from '../../Intel/src/custom-errors/ClassValidationError';


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

	static fromMatch(match: Match): ProfileMatchViewModel {
		const profileMatchViewModel = new ProfileMatchViewModel();

		profileMatchViewModel.id = match.id;
		profileMatchViewModel.date = match.date;
		if (match.logsId !== null) {
			profileMatchViewModel.logsId = match.logsId;
		}
		profileMatchViewModel.map = match.map;
		profileMatchViewModel.matchType = match.matchType;
		profileMatchViewModel.wasCaptain = match.matchPlayerData[0].wasCaptain;

		if (match.winningTeam === match.matchPlayerData[0].team) {
			profileMatchViewModel.outcome = Outcome.WIN;
		} else if (match.matchPlayerData[0].team === Team.NONE) {
			profileMatchViewModel.outcome = Outcome.WIN;
		} else {
			profileMatchViewModel.outcome = Outcome.LOSS;
		}

		profileMatchViewModel.team = match.matchPlayerData[0].team;
		profileMatchViewModel.tf2class = match.matchPlayerData[0].tf2class;

		const errors = validateSync(profileMatchViewModel);
			if (errors.length) {
				throw new ClassValidationError(errors);
			}

		return profileMatchViewModel;
	}
}