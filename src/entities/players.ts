import { Index, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('players', { schema:'pugdb' })
@Index('id_UNIQUE', ['id'], { unique:true })
@Index('steamid_UNIQUE', ['steamid'], { unique:true })
export class players {

  @PrimaryGeneratedColumn({
    type:'int',
    name:'id',
  })
    id:number;

  @Column('varchar', {
    nullable:false,
    unique: true,
    length:30,
    name:'steamid',
  })
    steamid:string;

  @Column('varchar', {
    nullable:true,
    length:50,
    name:'ip',
  })
    ip:string | null;

  @Column('int', {
    nullable:true,
    default:'0',
    name:'pugs',
  })
    pugs:number | null;

  @Column('int', {
    nullable:true,
    default:'0',
    name:'wins',
  })
    wins:number | null;

  @Column('int', {
    nullable:false,
    primary:true,
    default:'0',
    name:'losses',
  })
    losses:number;

  @Column('tinyint', {
    nullable:true,
    width:1,
    default:'0',
    name:'captain',
  })
    captain:boolean | null;

  @Column('int', {
    nullable:true,
    default:'0',
    name:'subsin',
  })
    subsin:number | null;

  @Column('int', {
    nullable:true,
    default:'0',
    name:'subsout',
  })
    subsout:number | null;

  @Column('tinyint', {
    nullable:true,
    width:1,
    default:'0',
    name:'crestrict',
  })
    crestrict:boolean | null;

  @Column('int', {
    nullable:true,
    default:'5',
    name:'goodboy',
  })
    goodboy:number | null;

  @Column('int', {
    nullable:true,
    default:'0',
    name:'captainpenalty',
  })
    captainpenalty:number | null;

  @Column('datetime', {
    nullable:true,
    name:'captainpenaltytime',
  })
    captainpenaltytime:Date | null;

  @Column('int', {
    nullable:true,
    default:'0',
    name:'elo',
  })
    elo:number | null;

  static getRecentPugs(limit?: number) {
    return {};
  }

}
