import {Entity, PrimaryColumn,PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, OneToOne, JoinColumn} from "typeorm";

import {Class} from "./Class"
import {User} from "./User"

@Entity()
export class SchedulePart {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!:         string;

    @ManyToOne(() => User, user => user.myclasses)
    owner!: User;

    @OneToOne(() => Class)
    @JoinColumn()
    class!: Class;
}
