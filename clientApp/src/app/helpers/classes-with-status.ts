import { Classes } from "../domain/classes";
import { ClassesStatusEnum } from "../enums/classes-status-enum";

export interface ClassesWithStatus {
    classes: Classes,
    status: ClassesStatusEnum
}