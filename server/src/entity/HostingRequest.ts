import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";

import {User} from "./User"
import {Class} from "./Class"

@Entity()
export class HostingRequest {

    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public status!: string;

    @ManyToOne(() => User, user => user.hostingRequests, {onDelete: 'CASCADE'})
    public user!: User;

    @ManyToOne(() => Class, cls => cls.hostingRequests, {onDelete: 'CASCADE'})
    public class!: Class;

}
