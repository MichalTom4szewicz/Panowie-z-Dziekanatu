import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, JoinTable} from "typeorm";

import {User} from "./User"
import {Class} from "./Class"

@Entity()
export class HostingRequest {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.hostingRequests)
    user!: User;

    @ManyToOne(() => Class, cls => cls.hostingRequests)
    class!: Class;

}
