import Player from '../../Intel/src/entities/Player';
import TFClassesTracker from '../Models/TFClassesTracker';
import ClassStatistics from '../Models/ClassStatistics';

export class ProfileViewModel {
	alias: string;
	steamid: string;
	avatarUrl: string;
	subsIn: number;
	subsOut: number;
	
	static fromPlayer(player: Player): ProfileViewModel {
		const profileViewModel = new ProfileViewModel();

		profileViewModel.alias = player.alias;
		profileViewModel.avatarUrl = player.avatarUrl;
		profileViewModel.steamid = player.steamid;
		profileViewModel.subsIn = player.subsIn;
		profileViewModel.subsOut = player.subsOut;
		
		return profileViewModel;
	}
}