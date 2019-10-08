import DraftTFClass from '../Enums/DraftTFClass';
import PlayerSettings from '../../Intel/src/entities/PlayerSettings';
import { IsNumber, IsBoolean, IsDefined, IsString } from 'class-validator';
import ValidateClass from '../../Intel/src/utils/ValidateClass';

export class PlayerSettingsViewModel {
	@IsBoolean()
	isNotifiableByMention: boolean = false;

	@IsNumber()
	volume: number = 50;

	@IsDefined()
	favoriteClasses: { [key in DraftTFClass]?: boolean } = {};

	@IsBoolean()
	addToFavoritesAfterMatch: boolean = false;

	@IsBoolean()
	addToFavoritesOnLogin: boolean = false;

	@IsBoolean()
	audioCuesEnabled: boolean = false;

	@IsString()
	voicepack: string = 'default';

	@IsString()
	colorOfNameInChat: string = 'default';
}
