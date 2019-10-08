import DraftTFClass from '../Enums/DraftTFClass';
import ProfileClassStatisticsViewModel from '../ViewModels/ProfileClassStatisticsViewModel';

class ClassStatistics {
	totalWinCount = 0;
	totalLossCount = 0;
	totalTieCount = 0;
	statistics: Map<DraftTFClass, ClassStatistic> = new Map();

	toProfileClassStatisticsViewModel() {
		const profileClassStatisticsViewModel = new ProfileClassStatisticsViewModel();

		this.statistics.forEach((classStatistic, draftTFClass) => {
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

		profileClassStatisticsViewModel.totalWinCount = this.totalWinCount;
		profileClassStatisticsViewModel.totalTieCount = this.totalTieCount;
		profileClassStatisticsViewModel.totalLossCount = this.totalLossCount;

		return profileClassStatisticsViewModel;
	}
}

class ClassStatistic {
	wins: number = 0;
	ties: number = 0;
	losses: number = 0;
}

interface ReaVizBarEntry {
	key: 'Wins' | 'Ties' | 'Losses';
	data: number;
}

interface ReaVizBar {
	key: DraftTFClass;
	data: ReaVizBarEntry[];
}

export { ClassStatistics, ClassStatistic };
