import DraftTFClass from '../Enums/DraftTFClass';

class ClassStatistics {
	totalWinCount = 0;
	totalLossCount = 0;
	totalTieCount = 0;
	statistics: Map<DraftTFClass, ClassStatistic> = new Map();
}

class ClassStatistic {
	wins: number = 0;
	ties: number = 0;
	losses: number = 0;
}

export { ClassStatistics, ClassStatistic };
