import DraftTFClass from '../Enums/DraftTFClass';

class ClassStatistics {
	totalWins = 0;
	totalLosses = 0;
	totalTies = 0;
	statistics: Map<DraftTFClass, ClassStatistic> = new Map();
}

class ClassStatistic {
	wins: number = 0;
	ties: number = 0;
	losses: number = 0;
}

export { ClassStatistics, ClassStatistic };
