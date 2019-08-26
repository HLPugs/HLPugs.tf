import TFClassesTracker from './TFClassesTracker';

class ClassStatistics {
	totalWins = 0;
	totalLosses = 0;
	totalTies = 0;
	winsByClass: TFClassesTracker = new TFClassesTracker();
	lossesByClass: TFClassesTracker = new TFClassesTracker();
	tiesByClass: TFClassesTracker = new TFClassesTracker();
}

export default ClassStatistics;
