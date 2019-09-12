import { Entity, Column, PrimaryColumn } from 'typeorm';
import { IsString, IsNotEmpty } from 'class-validator';

@Entity('blacklisted_words')
export default class BlacklistedWord {
	@PrimaryColumn()
	id: number; // abstract class requires id but is never needed for this entity

	@Column({ unique: true })
	@IsString()
	@IsNotEmpty()
	word: string;
}
