import {Entity, BaseEntity, PrimaryGeneratedColumn, PrimaryColumn, Column, OneToMany, ManyToOne} from "typeorm";

import {Course} from "./Course"
import {HostingRequest} from "./HostingRequest"
import {Class} from "./Class"
import {SchedulePart} from "./SchedulePart"

@Entity()
export class User {

    @PrimaryColumn()
    pesel!: string;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column({
    type: "varchar"
    })
    username!: string;

    @Column({
    type: "varchar"
    })
    password!: string;

    @OneToMany(() => Course, course => course.user, { cascade: ['insert', 'update'] })
    courses!: Course[];

    @OneToMany(() => HostingRequest, hr => hr.user, { cascade: ['insert', 'update'] })
    hostingRequests!: HostingRequest[];

    @OneToMany(() => Class, cls => cls.host, { cascade: ['insert', 'update'] })
    classes!: Class[];

    @OneToMany(() => SchedulePart, sp => sp.owner, { cascade: ['insert', 'update'] })
    myclasses!: SchedulePart[];

}
