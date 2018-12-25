import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('warnings', { schema:'pugdb' })
export class warnings {

  @PrimaryGeneratedColumn({
    type:'int',
    name:'id',
  })
    id:number;

  @Column('varchar', {
    nullable:false,
    length:512,
    name:'message',
  })
    message:string;

  @Column('varchar', {
    nullable:false,
    length:20,
    name:'alias',
  })
    alias:string;

  @Column('datetime', {
    nullable:false,
    name:'expiration',
  })
    expiration:Date;

  @Column('varchar', {
    nullable:false,
    length:20,
    name:'creator',
  })
    creator:string;

  @Column('datetime', {
    nullable:true,
    default:'CURRENT_TIMESTAMP',
    name:'date',
  })
    date:Date | null;

}
