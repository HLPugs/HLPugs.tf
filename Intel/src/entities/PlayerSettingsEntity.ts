import { Entity, Column, OneToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import PlayerEntity from './PlayerEntity';
import DraftTFClass from '../../../Common/Enums/DraftTFClass';
import { Allow, IsArray, IsNumber, IsBoolean, IsString } from 'class-validator';
import ValidateClass from '../utils/ValidateClass';
import { PlayerSettingsViewModel } from '../../../Common/ViewModels/PlayerSettingsViewModel';
import PlayerSettings from '../../../Common/Models/PlayerSettings';
import PlayerService from '../services/PlayerService';
import SteamID from '../../../Common/Types/SteamID';

@Entity('player_settings')
export default class PlayerSettingsEntity {
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

	@OneToOne(type => PlayerEntity, player => player.settings)
	@JoinColumn()
	@Allow()
	player: PlayerEntity;

	static toPlayerSettings(settings: PlayerSettingsEntity) {
		return ValidateClass<PlayerSettings>({
			addToFavoritesAfterMatch: settings.addToFavoritesAfterMatch,
			addToFavoritesOnLogin: settings.addToFavoritesOnLogin,
			audioCuesEnabled: settings.audioCuesEnabled,
			colorOfNameInChat: settings.colorOfNameInChat,
			favoriteClasses: settings.favoriteClasses,
			isNotifiableByMention: settings.isNotifiableByMention,
			voicepack: settings.voicepack,
			volume: settings.volume
		});
	}

	static async fromPlayerSettings(settingsId: number, steamid: SteamID, settings: PlayerSettings) {
		return ValidateClass<PlayerSettingsEntity>({
			id: 0,
			player: await PlayerEntity.getBySteamID(steamid),
			addToFavoritesAfterMatch: settings.addToFavoritesAfterMatch,
			addToFavoritesOnLogin: settings.addToFavoritesOnLogin,
			audioCuesEnabled: settings.audioCuesEnabled,
			colorOfNameInChat: settings.colorOfNameInChat,
			favoriteClasses: settings.favoriteClasses,
			isNotifiableByMention: settings.isNotifiableByMention,
			voicepack: settings.voicepack,
			volume: settings.volume
		});
	}
}
