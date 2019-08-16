import { Entity, Column, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import Player from './Player';

@Entity()
export default class PlayerSettings {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: false})
	isNotifiableByMention: boolean;

	@Column({ default: 50 })
	volume: number;

	@Column('simple-array', { nullable: true})
	favoriteClasses: Models.DraftTFClass[];

	@Column({ default: false })
	isAddToFavoritesAfterMatchEnabled: boolean;

	@Column({ default: false})
	isAddToFavoritesOnLoginEnabled: boolean;

	@Column({ default: true })
	areAudioCuesEnabled: boolean;

	@Column({ default: 'default'})
	voicepack: string; // enum ?

	@Column({ default: 'default' })
	colorOfNameInChat: string; // enum?
}