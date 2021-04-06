import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Class {

    @PrimaryGeneratedColumn()
    id!:           number;

    @Column()
    name!:         string;

    @Column()
    weekDay!:      string;

    @Column()
    startTime!:    string;

    @Column()
    endTime!:      string;

    @Column()
    host!:         string;

    @Column()
    building!:     string;

    @Column()
    room!:         string;

    @Column()
    groupKey!:     string;

    @Column()
    typ!:          string;

}
