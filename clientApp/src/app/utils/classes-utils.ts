import { WeekDay } from "@angular/common";
import { Classes } from "../domain/classes";
import { Course } from "../domain/course";
import { Degree } from "../enums/degree";
import { Parity } from "../enums/parity";
import { Typ } from "../enums/typ";

export class ClassesUtils {
  public static getEmptyClasses(): Classes {
    return this.getEmptyClassesWithCourse({
      name: '',
      courseKey: '',
      supervisor: {
        firstName: '',
        lastName: '',
        degree: Degree.NONE,
        username: ''
      }
    });
  }

  public static getEmptyClassesWithCourse(course: Course): Classes {
    return {
      weekDay: WeekDay.Monday,
      startTime: {
        hours: 0,
        minutes: 0
      },
      endTime: {
        hours: 0,
        minutes: 0
      },
      host: undefined,
      building: '',
      room: '',
      groupKey: '',
      course: course,
      typ: Typ.NONE,
      parity: Parity.NONE
    }
  }

  public static copyClasses(classes: Classes): Classes {
    return {
      weekDay: classes.weekDay,
      startTime: {
        hours: classes.startTime.hours,
        minutes: classes.startTime.minutes
      },
      endTime: {
        hours: classes.endTime.hours,
        minutes: classes.endTime.minutes
      },
      host: classes.host,
      building: classes.building,
      room: classes.room,
      groupKey: classes.groupKey,
      course: classes.course,
      typ: classes.typ,
      parity: classes.parity
    }
  }
}
