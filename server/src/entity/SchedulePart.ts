import {Entity, PrimaryColumn, Column, OneToMany, ManyToOne, OneToOne, JoinColumn} from "typeorm";

import {Class} from "./Class"
import {User} from "./User"

@Entity()
export class SchedulePart {

    @PrimaryColumn()
    name!:         string;

    @ManyToOne(() => User, user => user.classes)
    owner!: User;

    @OneToOne(() => Class)
    @JoinColumn()
    class!: Class;
}
