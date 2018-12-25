import { Index, Entity, Column } from 'typeorm';

@Entity('custom_chatcolors')
@Index('identity', ['identity'], { unique: true })
export class custom_chatcolors {

  @Column('int', {
    nullable: false,
    primary: true,
    name: 'index',
  })
  index: number;

  @Column('varchar', {
    nullable: false,
    unique: true,
    length: 32,
    name: 'identity',
  })
  identity: string;

  @Column('char', {
    nullable: true,
    length: 1,
    name: 'flag',
  })
  flag: string | null;

  @Column('varchar', {
    nullable: true,
    length: 32,
    name: 'tag',
  })
  tag: string | null;

  @Column('varchar', {
    nullable: true,
    length: 8,
    name: 'tagcolor',
  })
  tagcolor: string | null;

  @Column('varchar', {
    nullable: true,
    length: 8,
    name: 'namecolor',
  })
  namecolor: string | null;

  @Column('varchar', {
    nullable: true,
    length: 8,
    name: 'textcolor',
  })
  textcolor: string | null;

}
