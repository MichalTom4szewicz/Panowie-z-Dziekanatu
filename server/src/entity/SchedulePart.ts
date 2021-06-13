import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn} from "typeorm";

import {Class} from "./Class"
import {User} from "./User"

@Entity()
export class SchedulePart {

    @PrimaryGeneratedColumn()
    public id?: number;

    @Column()
    public name!:         string;

    @ManyToOne(() => User, user => user.myclasses, {onDelete: 'CASCADE'})
    public owner!: User;

    @ManyToOne(() => Class, clas => clas.schedules, {onDelete: 'CASCADE'})
    public class!: Class;
}
