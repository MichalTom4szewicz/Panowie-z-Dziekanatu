import {Entity, PrimaryColumn,PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, OneToOne, JoinColumn} from "typeorm";

import {Class} from "./Class"
import {User} from "./User"

@Entity()
export class SchedulePart {

    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public name!:         string;

    @ManyToOne(() => User, user => user.myclasses)
    public owner!: User;

    @OneToOne(() => Class)
    @JoinColumn()
    public class!: Class;
}
