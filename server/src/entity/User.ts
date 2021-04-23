import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne} from "typeorm";

import {Course} from "./Course"
import {HostingRequest} from "./HostingRequest"
import {Class} from "./Class"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    age!: number;

    @OneToMany(() => Course, course => course.user)
    courses!: Course[];

    @OneToMany(() => HostingRequest, hr => hr.user)
    hostingRequests!: HostingRequest[];

    @OneToMany(() => Class, cls => cls.host)
    classes!: Class[];

}
