import {Entity, PrimaryColumn, Column, OneToMany, ManyToOne} from "typeorm";

import {HostingRequest} from "./HostingRequest"
import {Course} from "./Course"
import {User} from "./User"
import { SchedulePart } from "./SchedulePart";

@Entity()
export class Class {

    @PrimaryColumn()
    public groupKey!:     string;

    @Column()
    public weekDay!:      number;

    @Column()
    public parity!:       string;

    @Column()
    public startTime!:    string;

    @Column()
    public endTime!:      string;

    @Column()
    public building!:     string;

    @Column()
    public room!:         string;

    @Column()
    public typ!:          string;

    @ManyToOne(() => User, user => user.classes, {onDelete: 'CASCADE'})
    public host?: User;

    @ManyToOne(() => Course, course => course.classes, {onDelete: 'CASCADE', eager: true})
    public course!: Course;

    @OneToMany(() => HostingRequest, hr => hr.class, { cascade: ['insert', 'update', 'remove'] })
    public hostingRequests!: HostingRequest[];

    @OneToMany(() => SchedulePart, sp => sp.class, { cascade: ['insert', 'update', 'remove'] })
    public schedules?: SchedulePart[];

}
