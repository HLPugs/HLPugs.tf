import { Entity, PrimaryGeneratedColumn, Column, Unique, Index } from 'typeorm';
import { Length, IsInt, IsBoolean, IsFQDN, IsOptional, IsString, IsIP, IsNumberString, Matches, Allow, IsEnum, ArrayUnique } from 'class-validator';
import { PermissionGroup } from '../enums/PermissionGroup';
import { Role } from '../enums/Role';
import { LinqRepository } from 'typeorm-linq-repository';

@Entity({ name: 'players' })
export class Player {

  @PrimaryGeneratedColumn()
  @Allow()
	id: number;

  @Column()
  @Index({ unique: true })
  @IsNumberString()
	steamid: string;

  @Column()
  @IsString()
  @Index({ unique: true })
  @Matches(/^[a-zA-Z0-9_]{2,17}$/)
  @Length(2, 17)
	alias: string;

  @Column()
  @IsFQDN()
  avatarUrl: string;
  
  @Column()
  @IsOptional()
  @IsEnum(PermissionGroup)
  permissionGroup: PermissionGroup;

  @Column('simple-array')
  @IsOptional()
  @ArrayUnique()
  roles: Role[];

  @Column()
  @IsIP('4')
	ip: string;

  @Column()
  @IsInt()
	pugs: number;

  @Column()
  @IsInt()
	wins: number;

  @Column()
  @IsInt()
	losses: number;

  @Column()
  @IsBoolean()
	isCaptain: boolean;

  @Column()
  @IsInt()
	subsIn: number;

  @Column()
  @IsInt()
	subsOut: number;

  @Column()
  @IsBoolean()
  isCrestricted: boolean;
}

export const playerRepository: LinqRepository<Player> = new LinqRepository(Player);
