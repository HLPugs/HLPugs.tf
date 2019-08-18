import { Entity, Column, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import Player from './Player';
//import DraftTFClass from '../../../common/Models/DraftTFClass';

@Entity()
export default class PlayerSettings {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: false})
	isNotifiableByMention: boolean;

	@Column({ default: 50 })
	volume: number;

	@Column('simple-array', { nullable: true})
	favoriteClasses: any[];

	@Column({ default: false })
	addToFavoritesAfterMatch: boolean;

	@Column({ default: false})
	addToFavoritesOnLogin: boolean;

	@Column({ default: true })
	audioCuesEnabled: boolean;

	@Column({ default: 'default'})
	voicepack: string; // enum ?

	@Column({ default: 'default' })
	colorOfNameInChat: string; // enum?

	@OneToOne(type => Player, player => player.settings)
	player: Player;
}