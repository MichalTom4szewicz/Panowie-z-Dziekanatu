import { ClassesWithStatus } from "./classes-with-status";


export interface ClassesGrid {
    rows: number,
    isNotEmpty: boolean,
    classes: ClassesWithStatus
    classesOddWeek?: ClassesWithStatus
}
