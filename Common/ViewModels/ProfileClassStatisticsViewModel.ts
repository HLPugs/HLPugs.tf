import { ClassStatistics } from '../Models/ClassStatistics';
import DraftTFClass from '../Enums/DraftTFClass';

export default class ProfileClassStatisticsViewModel {
	statistics: ReaVizBar[] = [];
	totalWinCount = 0;
	totalTieCount = 0;
	totalLossesCount = 0;

	static fromClassStatistics(classStatistics: ClassStatistics) {
		const profileClassStatisticsViewModel = new ProfileClassStatisticsViewModel();

		classStatistics.statistics.forEach((classStatistic, draftTFClass) => {
			const winEntry: ReaVizBarEntry = {
				key: 'Wins',
				data: classStatistic.wins
			};

			const tieEntry: ReaVizBarEntry = {
				key: 'Ties',
				data: classStatistic.ties
			};

			const lossEntry: ReaVizBarEntry = {
				key: 'Losses',
				data: classStatistic.losses
			};
			const reaVizBar: ReaVizBar = {
				key: draftTFClass,
				data: [lossEntry, tieEntry, winEntry]
			};

			profileClassStatisticsViewModel.statistics.push(reaVizBar);
		});

		profileClassStatisticsViewModel.totalWinCount =
			classStatistics.totalWinCount;
		profileClassStatisticsViewModel.totalTieCount =
			classStatistics.totalTieCount;
		profileClassStatisticsViewModel.totalLossesCount =
			classStatistics.totalLossCount;

		return profileClassStatisticsViewModel;
	}
}

interface ReaVizBarEntry {
	key: 'Wins' | 'Ties' | 'Losses';
	data: number;
}

interface ReaVizBar {
	key: DraftTFClass;
	data: ReaVizBarEntry[];
}
