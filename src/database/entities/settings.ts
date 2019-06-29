import {Index,Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, ManyToMany, JoinColumn, JoinTable, RelationId} from "typeorm";


@Entity("settings",{schema:"pugdb"})
@Index("steamid_UNIQUE",["steamid",],{unique:true})
export class settings {

    @Column("varchar",{ 
        nullable:false,
        primary:true,
        length:30,
        name:"steamid"
        })
    steamid:string;
        

    @Column("tinyint",{ 
        nullable:true,
        width:1,
        default:"1",
        name:"notifications"
        })
    notifications:boolean | null;
        

    @Column("int",{ 
        nullable:true,
        default:"50",
        name:"volume"
        })
    volume:number | null;
        

    @Column("tinyint",{ 
        nullable:true,
        width:1,
        default:"1",
        name:"sound"
        })
    sound:boolean | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:40,
        name:"alias"
        })
    alias:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:15,
        default:"default",
        name:"voicepack"
        })
    voicepack:string | null;
        

    @Column("tinyint",{ 
        nullable:true,
        width:1,
        default:"1",
        name:"chat_notifications"
        })
    chat_notifications:boolean | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:9,
        default:"012345678",
        name:"favorite_classes"
        })
    favorite_classes:string | null;
        

    @Column("tinyint",{ 
        nullable:true,
        width:1,
        default:"0",
        name:"auto_join_initial_load"
        })
    auto_join_initial_load:boolean | null;
        

    @Column("tinyint",{ 
        nullable:true,
        width:1,
        default:"0",
        name:"auto_join_after_pug"
        })
    auto_join_after_pug:boolean | null;
        

    @Column("tinyint",{ 
        nullable:true,
        width:1,
        default:"1",
        name:"draft_animations"
        })
    draft_animations:boolean | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:30,
        default:"none",
        name:"specialfx"
        })
    specialfx:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:50,
        default:"default",
        name:"color"
        })
    color:string | null;
        
}
