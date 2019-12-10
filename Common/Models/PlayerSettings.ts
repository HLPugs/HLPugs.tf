import { IsBoolean, IsNumber, IsArray, IsString } from 'class-validator';
import DraftTFClass from '../Enums/DraftTFClass';
import { PlayerSettingsViewModel } from '../ViewModels/PlayerSettingsViewModel';
import PlayerSettingsEntity from '../../Intel/src/entities/PlayerSettingsEntity';
import ValidateClass from '../../Intel/src/utils/ValidateClass';

export default class PlayerSettings {
	@IsBoolean()
	isNotifiableByMention: boolean = false;

	@IsNumber()
	volume: number;

	@IsArray()
	favoriteClasses: DraftTFClass[] = [];

	@IsBoolean()
	addToFavoritesAfterMatch: boolean = false;

	@IsBoolean()
	addToFavoritesOnLogin: boolean = false;

	@IsBoolean()
	audioCuesEnabled: boolean = false;

	@IsString()
	voicepack: string = 'default'; // enum ?

	@IsString()
	colorOfNameInChat: string = 'default'; // enum?

	static fromViewModel(playerSettingsViewModel: PlayerSettingsViewModel): PlayerSettings {
		const playerSettings = new this();
		playerSettings.addToFavoritesAfterMatch = playerSettingsViewModel.addToFavoritesAfterMatch;
		playerSettings.addToFavoritesOnLogin = playerSettingsViewModel.addToFavoritesOnLogin;
		playerSettings.audioCuesEnabled = playerSettingsViewModel.audioCuesEnabled;
		playerSettings.colorOfNameInChat = playerSettingsViewModel.colorOfNameInChat;
		playerSettings.isNotifiableByMention = playerSettingsViewModel.isNotifiableByMention;
		playerSettings.voicepack = playerSettingsViewModel.voicepack;
		playerSettings.volume = playerSettingsViewModel.volume;
		playerSettings.favoriteClasses = [];
		for (const tf2class in playerSettingsViewModel.favoriteClasses) {
			if (playerSettingsViewModel.favoriteClasses[tf2class as DraftTFClass]) {
				playerSettings.favoriteClasses.push(tf2class as DraftTFClass);
			}
		}
		return ValidateClass(playerSettings);
	}

	static toPlayerSettingsViewmodel(settings: PlayerSettings) {
		const playerSettingsViewModel = new PlayerSettingsViewModel();
		playerSettingsViewModel.addToFavoritesAfterMatch = settings.addToFavoritesAfterMatch;
		playerSettingsViewModel.addToFavoritesOnLogin = settings.addToFavoritesOnLogin;
		playerSettingsViewModel.audioCuesEnabled = settings.audioCuesEnabled;
		playerSettingsViewModel.colorOfNameInChat = settings.colorOfNameInChat;
		playerSettingsViewModel.isNotifiableByMention = settings.isNotifiableByMention;
		playerSettingsViewModel.voicepack = settings.voicepack;
		playerSettingsViewModel.volume = settings.volume;

		settings.favoriteClasses.forEach(tf2class => {
			playerSettingsViewModel.favoriteClasses[tf2class] = true;
		});
		return ValidateClass(playerSettingsViewModel);
	}
}
