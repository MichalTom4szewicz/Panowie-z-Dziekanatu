import {Entity, PrimaryColumn, Column, OneToMany} from "typeorm";

import {Course} from "./Course"
import {HostingRequest} from "./HostingRequest"
import {Class} from "./Class"
import {SchedulePart} from "./SchedulePart"

@Entity()
export class User {

    @Column()
    public firstName!: string;

    @Column()
    public degree!: string;

    @Column()
    public lastName!: string;

    @PrimaryColumn({
    type: "varchar"
    })
    public username!: string;

    @OneToMany(() => Course, course => course.supervisor, { cascade: ['insert', 'update', 'remove'] })
    public courses!: Course[];

    @OneToMany(() => HostingRequest, hr => hr.user, { cascade: ['insert', 'update', 'remove'] })
    public hostingRequests!: HostingRequest[];

    @OneToMany(() => Class, cls => cls.host, { cascade: ['insert', 'update', 'remove'] })
    public classes!: Class[];

    @OneToMany(() => SchedulePart, sp => sp.owner, { cascade: ['insert', 'update', 'remove'] })
    public myclasses!: SchedulePart[];

}
