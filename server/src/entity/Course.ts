import {Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany} from "typeorm";

import {User} from "./User"
import {Class} from "./Class"

@Entity()
export class Course {

    @PrimaryColumn()
    public courseKey!: string;

    @Column()
    public name!: string;

    @ManyToOne(() => User, usr => usr.courses)
    public user!: User;

    @OneToMany(() => Class, cls => cls.course, { cascade: ['insert', 'update', 'remove'] })
    public classes!: Class[];
}
