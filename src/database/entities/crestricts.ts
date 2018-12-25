import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";


@Entity("crestricts",{schema:"pugdb"})
export class crestricts {

    @PrimaryGeneratedColumn({
        type:"int", 
        name:"id"
        })
    id:number;
        

    @Column("varchar",{ 
        nullable:false,
        length:45,
        name:"steamid"
        })
    steamid:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:45,
        name:"creator"
        })
    creator:string;
        

    @Column("datetime",{ 
        nullable:false,
        default:"CURRENT_TIMESTAMP",
        name:"date"
        })
    date:Date;
        
}
