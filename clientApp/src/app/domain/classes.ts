import { Time, WeekDay } from "@angular/common";

export interface Classes {
    name: string,
    weekDay: WeekDay,
    startTime: Time,
    endTime: Time,
    host: string,
    building: string,
    room: string,
    groupKey: string,
    typ: string
}