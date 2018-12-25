import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('settings')
export class settings {

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    nullable: false,
    primary: true,
    length: 30,
    name: 'steamid',
  })
  steamid: string;

  @Column({
    nullable: true,
    width: 1,
    default: '1',
    name: 'notifications',
  })
  notifications: boolean | null;

  @Column('int', {
    nullable: true,
    default: '50',
    name: 'volume',
  })
  volume: number | null;

  @Column({
    nullable: true,
    width: 1,
    default: '1',
    name: 'sound',
  })
  sound: boolean | null;

  @Column('varchar', {
    nullable: true,
    length: 40,
    name: 'alias',
  })
  alias: string | null;

  @Column('varchar', {
    nullable: true,
    length: 15,
    default: 'default',
    name: 'voicepack',
  })
  voicepack: string | null;

  @Column({
    nullable: true,
    width: 1,
    default: '1',
    name: 'chat_notifications',
  })
  chatNotifications: boolean | null;

  @Column('varchar', {
    nullable: true,
    length: 9,
    default: '012345678',
    name: 'favorite_classes',
  })
  favoriteClasses: string | null;

  @Column({
    nullable: true,
    width: 1,
    default: '0',
    name: 'auto_join_initial_load',
  })
  autoJoinInitialLoad: boolean | null;

  @Column({
    nullable: true,
    width: 1,
    default: '0',
    name: 'auto_join_after_pug',
  })
  autoJoinAfterPug: boolean | null;

  @Column({
    nullable: true,
    width: 1,
    default: '1',
    name: 'draft_animations',
  })
  draftAnimations: boolean | null;

  @Column('varchar', {
    nullable: true,
    length: 30,
    default: 'none',
    name: 'specialfx',
  })
  specialfx: string | null;

  @Column('varchar', {
    nullable: true,
    length: 50,
    default: 'default',
    name: 'color',
  })
  color: string | null;

}
