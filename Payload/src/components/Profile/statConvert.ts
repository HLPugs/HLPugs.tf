import ClassStatistics from '../../../../Common/Models/ClassStatistics';
import TFClassesTracker from '../../../../Common/Models/TFClassesTracker';

type outcomes = 'Wins' | 'Ties' | 'Losses';

export default function statConvert(data: ClassStatistics): any {
	const shortenedStats = {
		Wins: data.winsByClass,
		Ties: data.tiesByClass,
		Losses: data.lossesByClass
	};

	const intermediate: any = {};

	Object.keys(shortenedStats.Wins).forEach(
		TFClass => (intermediate[TFClass] = [])
	);

	Object.keys(shortenedStats).forEach(outcome =>
		Object.keys(shortenedStats[outcome as outcomes]).forEach(TFClass => {
			const stat: any = {
				key: outcome,
				data:
					shortenedStats[outcome as outcomes][TFClass as keyof TFClassesTracker]
			};
			intermediate[TFClass].push(stat);
		})
	);

	return Object.keys(intermediate).map(TFCLass => {
		return { key: TFCLass, data: intermediate[TFCLass] };
	});
}
