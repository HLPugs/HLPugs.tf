import { Entity, Column, OneToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import Player from './Player';
import DraftTFClass from '../../../Common/Enums/DraftTFClass';
import { Allow, IsArray, IsNumber, IsBoolean, IsString } from 'class-validator';
import ValidateClass from '../utils/ValidateClass';
import { PlayerSettingsViewModel } from '../../../Common/ViewModels/PlayerSettingsViewModel';

@Entity()
export default class PlayerSettings {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: false })
	@IsBoolean()
	isNotifiableByMention: boolean = false;

	@Column({ default: 50 })
	@IsNumber()
	volume: number = 50;

	@Column('simple-array', { default: '' })
	@IsArray()
	favoriteClasses: DraftTFClass[] = [];

	@Column({ default: false })
	@IsBoolean()
	addToFavoritesAfterMatch: boolean = false;

	@Column({ default: false })
	@IsBoolean()
	addToFavoritesOnLogin: boolean = false;

	@Column({ default: true })
	@IsBoolean()
	audioCuesEnabled: boolean = false;

	@Column({ default: 'default' })
	@IsString()
	voicepack: string = 'default'; // enum ?

	@Column({ default: 'default' })
	@IsString()
	colorOfNameInChat: string = 'default'; // enum?

	@OneToOne(type => Player, player => player.settings)
	@JoinColumn()
	@Allow()
	player: Player;

	static fromViewModel(playerSettingsViewModel: PlayerSettingsViewModel): PlayerSettings {
		const playerSettings = new PlayerSettings();
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
}
