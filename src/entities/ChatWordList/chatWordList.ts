import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('chat_words')
export class ChatWordList {

  @PrimaryColumn()
    id: number;

  @Column({ type: 'text', array: true })
    whitelisted: string[];

  @Column({ type: 'text', array: true })
    blacklisted: string[];

}
