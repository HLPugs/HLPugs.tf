import ProfileMatchViewModel from '../ViewModels/ProfileMatchViewModel';

	export default class ProfilePaginatedMatchesViewModel {
		matches!: ProfileMatchViewModel[];
		totalMatches!: number;
	}