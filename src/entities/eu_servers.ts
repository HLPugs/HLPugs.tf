import { Entity, Column } from 'typeorm';

@Entity('eu_servers', { schema:'pugdb' })
export class eu_servers {

  @Column('int', {
    nullable:false,
    primary:true,
    name:'serverid',
  })
    serverid:number;

  @Column('int', {
    nullable:true,
    name:'redscore',
  })
    redscore:number | null;

  @Column('int', {
    nullable:true,
    name:'bluscore',
  })
    bluscore:number | null;

  @Column('float', {
    nullable:true,
    precision:12,
    name:'roundtime',
  })
    roundtime:number | null;

  @Column('float', {
    nullable:true,
    precision:12,
    name:'matchtime',
  })
    matchtime:number | null;

  @Column('int', {
    nullable:true,
    name:'busy',
  })
    busy:number | null;

  @Column('int', {
    nullable:true,
    name:'event',
  })
    event:number | null;

  @Column('varchar', {
    nullable:true,
    length:45,
    name:'map',
  })
    map:string | null;

  @Column('varchar', {
    nullable:true,
    length:45,
    name:'winner',
  })
    winner:string | null;

  @Column('tinyint', {
    nullable:true,
    width:1,
    name:'finished',
  })
    finished:boolean | null;

}
