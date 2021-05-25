import { Time, WeekDay } from "@angular/common";
import { Parity } from "../enums/parity";
import { Typ } from "../enums/typ";
import { Course } from "./course";
import { User } from "./user";

export interface Classes {
    weekDay: WeekDay,
    startTime: Time,
    endTime: Time,
    host?: User,
    building: string,
    room: string,
    groupKey: string,
    course: Course,
    typ: Typ,
    parity: Parity
}