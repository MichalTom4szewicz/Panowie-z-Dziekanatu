import { Time } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Typ } from 'src/app/enums/typ';
import { CalendarUtils } from 'src/app/utils/calendar-utils';
import { UserUtils } from 'src/app/utils/user-utils';
import { ClassesStatusEnum } from 'src/app/enums/classes-status-enum';
import { ClassesWithStatus } from 'src/app/helpers/classes-with-status';

@Component({
  selector: 'pzd-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.sass']
})
export class ClassesComponent implements OnInit {

  @Input() classes: ClassesWithStatus;
  @Input() scheduleView: boolean = false;
  private display: Map<ClassesStatusEnum, any>;

  private static readonly STANDARD_CLASSES_DURATION: number = 105;

  constructor() { }

  ngOnInit(): void {
    this.display = new Map([
      [ClassesStatusEnum.SELECTED, this.classesSelected()],
      [ClassesStatusEnum.CONFLICT, this.classesConflict()],
      [ClassesStatusEnum.UNSELECTED, this.classesUnselected()],
      [ClassesStatusEnum.CREATE_SCHEDULE, this.classesCreateSchedule()],
      [ClassesStatusEnum.PENDING, this.classesPending()],
      [ClassesStatusEnum.ACCEPTED, this.classesAccepted()],
      [ClassesStatusEnum.REJECTED, this.classesRejected()]
    ]);
  }

  public getTime(time: Time): string {
    return CalendarUtils.getTime(time);
  }

  public getClass() {
    return this.display.get(this.classes.status!);
  }

  public displayUser(): string {
    return UserUtils.displayUser(this.classes.classes.course.supervisor);
  }

  private duration(): number {
    return CalendarUtils.getTimeInMinutes(this.classes.classes.endTime) - CalendarUtils.getTimeInMinutes(this.classes.classes.startTime);
  }

  private classesSelected(): any {
    return {
      'project-selected': this.classes.classes.typ === Typ.PROJECT,
      'exercise-selected': this.classes.classes.typ === Typ.EXERCISE,
      'seminar-selected': this.classes.classes.typ === Typ.SEMINAR,
      'laboratories-selected': this.classes.classes.typ === Typ.LABORATORIES,
      'lecture-selected': this.classes.classes.typ === Typ.LECTURE
    };
  }

  private classesConflict(): any {
    return {
      'project-conflict': this.classes.classes.typ === Typ.PROJECT,
      'exercise-conflict': this.classes.classes.typ === Typ.EXERCISE,
      'seminar-conflict': this.classes.classes.typ === Typ.SEMINAR,
      'laboratories-conflict': this.classes.classes.typ === Typ.LABORATORIES,
      'lecture-conflict': this.classes.classes.typ === Typ.LECTURE
    };
  }

  private classesUnselected(): any {
    return {
      'project': this.classes.classes.typ === Typ.PROJECT,
      'exercise': this.classes.classes.typ === Typ.EXERCISE,
      'seminar': this.classes.classes.typ === Typ.SEMINAR,
      'laboratories': this.classes.classes.typ === Typ.LABORATORIES,
      'lecture': this.classes.classes.typ === Typ.LECTURE
    };
  }

  private classesCreateSchedule() {
    return {
      'project': this.classes.classes.typ === Typ.PROJECT,
      'exercise': this.classes.classes.typ === Typ.EXERCISE,
      'seminar': this.classes.classes.typ === Typ.SEMINAR,
      'laboratories': this.classes.classes.typ === Typ.LABORATORIES,
      'lecture': this.classes.classes.typ === Typ.LECTURE,
      'schedule': this.duration() > ClassesComponent.STANDARD_CLASSES_DURATION,
      'schedule-small': this.duration() <= ClassesComponent.STANDARD_CLASSES_DURATION
    };
  }

  private classesPending(): any {
    return {
      'project-conflict': this.classes.classes.typ === Typ.PROJECT,
      'exercise-conflict': this.classes.classes.typ === Typ.EXERCISE,
      'seminar-conflict': this.classes.classes.typ === Typ.SEMINAR,
      'laboratories-conflict': this.classes.classes.typ === Typ.LABORATORIES,
      'lecture-conflict': this.classes.classes.typ === Typ.LECTURE,
      'schedule': this.duration() > ClassesComponent.STANDARD_CLASSES_DURATION,
      'schedule-small': this.duration() <= ClassesComponent.STANDARD_CLASSES_DURATION
    };
  }

  private classesAccepted(): any {
    return this.classesCreateSchedule();
  }

  private classesRejected(): any {
    return {
      'rejected': true,
      'schedule': this.duration() > ClassesComponent.STANDARD_CLASSES_DURATION,
      'schedule-small': this.duration() <= ClassesComponent.STANDARD_CLASSES_DURATION
    };
  }
}
