import SteamID from '../Types/SteamID';
import { IsString, IsNotEmpty, ValidateNested, IsDefined } from 'class-validator';
import { PlayerSettingsViewModel } from '../ViewModels/PlayerSettingsViewModel';
import ValidateClass from '../../Intel/src/utils/ValidateClass';

export default class UpdatePlayerSettingsRequest {
	constructor(playerSettingsViewmodel: PlayerSettingsViewModel) {
		this.playerSettingsViewModel = playerSettingsViewmodel;
	}

	@IsDefined()
	@ValidateNested()
	playerSettingsViewModel: PlayerSettingsViewModel;
}
