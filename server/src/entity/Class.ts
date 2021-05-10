import {Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, OneToMany, ManyToOne} from "typeorm";

import {HostingRequest} from "./HostingRequest"
import {Course} from "./Course"
import {User} from "./User"

@Entity()
export class Class {

    @PrimaryColumn()
    groupKey!:     string;

    @Column()
    name!:         string;

    @Column()
    weekDay!:      string;

    @Column()
    parity!:       string;

    @Column()
    startTime!:    string;

    @Column()
    endTime!:      string;

    @Column()
    building!:     string;

    @Column()
    room!:         string;

    @Column()
    typ!:          string;

    @ManyToOne(() => User, user => user.classes)
    host!: User;

    @ManyToOne(() => Course, course => course.classes)
    course!: Course;

    @OneToMany(() => HostingRequest, hr => hr.class, { cascade: ['insert', 'update'] })
    hostingRequests!: HostingRequest[];

}
