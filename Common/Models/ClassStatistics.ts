import TFClassesTracker from './TFClassesTracker';

class ClassStatistics {
	totalWins: number = 0;
	totalLosses: number = 0;
	totalTies: number = 0;
	winsByClass: TFClassesTracker = new TFClassesTracker();
	lossesByClass: TFClassesTracker = new TFClassesTracker();
	tiesByClass: TFClassesTracker = new TFClassesTracker();
}

export default ClassStatistics;