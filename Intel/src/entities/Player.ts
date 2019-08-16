import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany, PrimaryColumn, ManyToMany, JoinTable } from 'typeorm';
import { Length, IsInt, IsBoolean, IsFQDN, IsOptional, IsString, IsIP, IsNumberString, Matches, Allow, IsEnum, ArrayUnique } from 'class-validator';
import Match from './Match';
import { MatchToPlayer } from './MatchToPlayer';
import PermissionGroupName from '../../../Common/Enums/PermissionGroup';
import Role from '../../../Common/Enums/Role';

@Entity({ name: 'players' })
export default class Player {

  @PrimaryGeneratedColumn()
  @Allow()
  id: number;

  @Column()
  @Index({ unique: true })
  @IsNumberString()
  steamid: string;

  @Column({ nullable: true })
  @IsString()
  @Index({ unique: true })
  @Matches(/^[a-zA-Z0-9_]{2,17}$/)
  @Length(2, 17)
  alias: string;

  @Column()
  @IsFQDN()
  avatarUrl: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsEnum(PermissionGroupName)
  permissionGroup: PermissionGroupName;

  @Column('simple-array', { nullable: true})
  @IsOptional()
  @ArrayUnique()
  roles: Role[];

  @Column()
  @IsIP('4')
  ip: string;

  @Column({ default: 0 })
  @IsInt()
  totalPugCount: number;

  @Column({ default: 0 })
  @IsInt()
  totalWinCount: number;

  @Column({ default: 0 })
  @IsInt()
  totalLossCount: number;

  @Column({ default: false })
  @IsBoolean()
  isCaptain: boolean;

  @Column({default: 0})
  @IsInt()
  subsIn: number;

  @Column({default: 0})
  @IsInt()
  subsOut: number;

  @Column({default: false})
  @IsBoolean()
  isCrestricted: boolean;

  @ManyToMany(type => Match, match => match.players)
  matches: Match[];

  @OneToMany(type => MatchToPlayer, matchToPlayer => matchToPlayer.player)
  matchToPlayerCategories: MatchToPlayer[];
}
