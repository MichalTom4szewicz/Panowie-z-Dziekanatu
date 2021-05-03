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

    @OneToMany(() => Course, course => course.user, { cascade: ['insert', 'update'] })
    courses!: Course[];

    @OneToMany(() => HostingRequest, hr => hr.user, { cascade: ['insert', 'update'] })
    hostingRequests!: HostingRequest[];

    @OneToMany(() => Class, cls => cls.host, { cascade: ['insert', 'update'] })
    classes!: Class[];

}
