import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany} from "typeorm";

import {User} from "./User"
import {Class} from "./Class"

@Entity()
export class Course {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @ManyToOne(type => User)
    @JoinColumn({ referencedColumnName: "id" })
    user!: User;

    // @OneToMany(() => Class, cls => cls.course, { cascade: ['insert', 'update'] })
    // classes!: Class[];
}
