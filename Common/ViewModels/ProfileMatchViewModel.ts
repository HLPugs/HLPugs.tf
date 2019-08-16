import Match from '../../Intel/src/entities/Match';
import MatchType from '../Enums/MatchType';
import Team from '../Enums/Team';

export default class ProfileMatchViewModel {
	id: number;
	matchType: MatchType;
	map: String;
	winningTeam: Team
	date: Date;
	logsId: number;

	static fromMatch(match: Match) {
		const profileMatchViewModel = new ProfileMatchViewModel();

		profileMatchViewModel.id = match.id;
		profileMatchViewModel.date = match.date;
		profileMatchViewModel.logsId = match.logsId;
		profileMatchViewModel.map = match.map;
		profileMatchViewModel.matchType = match.matchType;
		profileMatchViewModel.winningTeam = match.winningTeam;

		return profileMatchViewModel;
	}
}