import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('bans', { schema:'pugdb' })
export class bans {

  @PrimaryGeneratedColumn({
    type:'int',
    name:'id',
  })
    id:number;

  @Column('varchar', {
    nullable:false,
    length:30,
    name:'steamid',
  })
    steamid:string;

  @Column('varchar', {
    nullable:false,
    length:512,
    name:'reason',
  })
    reason:string;

  @Column('datetime', {
    nullable:false,
    name:'expiration',
  })
    expiration:Date;

  @Column('datetime', {
    nullable:false,
    name:'date',
  })
    date:Date;

}
