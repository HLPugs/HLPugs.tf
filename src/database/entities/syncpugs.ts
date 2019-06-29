import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";


@Entity("syncpugs",{schema:"pugdb"})
export class syncpugs {

    @Column("int",{ 
        nullable:true,
        name:"pugid"
        })
    pugid:number | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:30,
        name:"steamid"
        })
    steamid:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:45,
        name:"team"
        })
    team:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:45,
        name:"tf2class"
        })
    tf2class:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:45,
        name:"captain"
        })
    captain:string | null;
        
}
