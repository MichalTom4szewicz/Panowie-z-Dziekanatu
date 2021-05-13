import { Time } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Classes } from 'src/app/domain/classes';
import { Typ } from 'src/app/enums/typ';
import { CalendarUtils } from 'src/app/utils/calendar-utils';
import { ClassesStatusEnum } from '../../enums/classes-status-enum';

@Component({
  selector: 'pzd-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.sass']
})
export class ClassesComponent implements OnInit {

  @Input() classes: Classes;
  @Input() status?: ClassesStatusEnum;
  @Input() scheduleView: boolean = false;

  private static readonly STANDARD_CLASSES_DURATION: number = 105;

  constructor() { }

  ngOnInit(): void {}

  public getTime(time: Time): string {
    return CalendarUtils.getTime(time);
  }

  getClass() {
    if (this.scheduleView) {
      return this.getClassForScheduleView();
    } else {
      return this.getClassForGridView();
    }
  }

  private getClassForScheduleView() {
    return {
      'project': this.classes.typ === Typ.PROJECT,
      'exercise': this.classes.typ === Typ.EXERCISE,
      'seminar': this.classes.typ === Typ.SEMINAR,
      'laboratories': this.classes.typ === Typ.LABORATORIES,
      'lecture': this.classes.typ === Typ.LECTURE,
      'schedule': this.duration() > ClassesComponent.STANDARD_CLASSES_DURATION,
      'schedule-small': this.duration() <= ClassesComponent.STANDARD_CLASSES_DURATION
    };
  }

  private duration(): number {
    return CalendarUtils.getTimeInMinutes(this.classes.endTime) - CalendarUtils.getTimeInMinutes(this.classes.startTime);
  }

  private getClassForGridView() {
    if (this.status === ClassesStatusEnum.SELECTED) {
      return {
        'project-selected': this.classes.typ === Typ.PROJECT,
        'exercise-selected': this.classes.typ === Typ.EXERCISE,
        'seminar-selected': this.classes.typ === Typ.SEMINAR,
        'laboratories-selected': this.classes.typ === Typ.LABORATORIES,
        'lecture-selected': this.classes.typ === Typ.LECTURE
      };
    } else if (this.status === ClassesStatusEnum.CONFLICT) {
      return {
        'project-conflict': this.classes.typ === Typ.PROJECT,
        'exercise-conflict': this.classes.typ === Typ.EXERCISE,
        'seminar-conflict': this.classes.typ === Typ.SEMINAR,
        'laboratories-conflict': this.classes.typ === Typ.LABORATORIES,
        'lecture-conflict': this.classes.typ === Typ.LECTURE
      };
    } else {
      return {
        'project': this.classes.typ === Typ.PROJECT,
        'exercise': this.classes.typ === Typ.EXERCISE,
        'seminar': this.classes.typ === Typ.SEMINAR,
        'laboratories': this.classes.typ === Typ.LABORATORIES,
        'lecture': this.classes.typ === Typ.LECTURE
      };
    }
  }
}
