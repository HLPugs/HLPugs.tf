import SteamID from '../Types/SteamID';
import { IsString, IsNotEmpty, ValidateNested, IsDefined } from 'class-validator';
import { PlayerSettingsViewModel } from '../ViewModels/PlayerSettingsViewModel';

export default class UpdatePlayerSettingsRequest {
	@IsString()
	@IsNotEmpty()
	steamid: SteamID

	@IsDefined()
	@ValidateNested()
	playerSettingsViewModel: PlayerSettingsViewModel;
}