import { Index, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('pugs', { schema:'pugdb' })
@Index('idpugs_UNIQUE', ['idpugs'], { unique:true })
export class pugs {

  @PrimaryGeneratedColumn({
    type:'int',
    name:'idpugs',
  })
    idpugs:number;

  @Column('varchar', {
    nullable:false,
    length:45,
    name:'map',
  })
    map:string;

  @Column('int', {
    nullable:false,
    name:'winner',
  })
    winner:number;

  @Column('datetime', {
    nullable:true,
    default:'CURRENT_TIMESTAMP',
    name:'date',
  })
    date:Date | null;

  @Column('varchar', {
    nullable:true,
    length:45,
    name:'logslink',
  })
    logslink:string | null;

}
