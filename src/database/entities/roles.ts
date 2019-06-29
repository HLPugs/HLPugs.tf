import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";


@Entity("roles",{schema:"pugdb"})
export class roles {

    @Column("varchar",{ 
        nullable:false,
        primary:true,
        length:30,
        name:"steamid"
        })
    steamid:string;
        

    @Column("int",{ 
        nullable:true,
        default:"0",
        name:"admin"
        })
    admin:number | null;
        

    @Column("int",{ 
        nullable:true,
        default:"0",
        name:"moderator"
        })
    moderator:number | null;
        

    @Column("int",{ 
        nullable:true,
        default:"0",
        name:"patron"
        })
    patron:number | null;
        

    @Column("int",{ 
        nullable:true,
        default:"0",
        name:"voiceactor"
        })
    voiceactor:number | null;
        

    @Column("datetime",{ 
        nullable:true,
        default:"CURRENT_TIMESTAMP",
        name:"modified"
        })
    modified:Date | null;
        

    @Column("varchar",{ 
        nullable:false,
        length:30,
        name:"addedby"
        })
    addedby:string;
        
}
