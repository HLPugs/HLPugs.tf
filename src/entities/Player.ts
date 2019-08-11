import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany } from 'typeorm';
import { Length, IsInt, IsBoolean, IsFQDN, IsOptional, IsString, IsIP, IsNumberString, Matches, Allow, IsEnum, ArrayUnique } from 'class-validator';
import { PermissionGroupName } from '../enums/PermissionGroup';
import { Role } from '../enums/Role';
import { LinqRepository } from 'typeorm-linq-repository';
import Punishment from './Punishment';

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
  pugs: number;

  @Column({ default: 0 })
  @IsInt()
  wins: number;

  @Column({ default: 0 })
  @IsInt()
  losses: number;

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

  // @OneToMany()
  activePunishments: Punishment[];
}
