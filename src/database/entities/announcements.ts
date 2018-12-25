import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('announcements', { schema:'pugdb' })
export class announcements {

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
    name:'creator',
  })
    creator:string;

  @Column('varchar', {
    nullable:true,
    length:45,
    default:'all',
    name:'region',
  })
    region:string | null;

}
