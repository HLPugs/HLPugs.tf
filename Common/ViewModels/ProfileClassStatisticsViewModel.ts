import { ClassStatistics } from '../Models/ClassStatistics';
import DraftTFClass from '../Enums/DraftTFClass';
import { IsArray, IsNumber } from 'class-validator';

export default class ProfileClassStatisticsViewModel {
	@IsArray()
	statistics: ReaVizBar[] = [];

	@IsNumber()
	totalWinCount = 0;

	@IsNumber()
	totalTieCount = 0;

	@IsNumber()
	totalLossCount = 0;
}

interface ReaVizBar {
	key: DraftTFClass;
	data: ReaVizBarEntry[];
}

interface ReaVizBarEntry {
	key: 'Wins' | 'Ties' | 'Losses';
	data: number;
}
