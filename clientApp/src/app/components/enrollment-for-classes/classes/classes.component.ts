import { Time } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Classes } from 'src/app/domain/classes';
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
      'project': this.classes.typ === 'P',
      'exercise': this.classes.typ === 'C',
      'seminar': this.classes.typ === 'S',
      'laboratories': this.classes.typ === 'L',
      'lecture': this.classes.typ === 'W',
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
        'project-selected': this.classes.typ === 'P',
        'exercise-selected': this.classes.typ === 'C',
        'seminar-selected': this.classes.typ === 'S',
        'laboratories-selected': this.classes.typ === 'L',
        'lecture-selected': this.classes.typ === 'W'
      };
    } else if (this.status === ClassesStatusEnum.CONFLICT) {
      return {
        'project-conflict': this.classes.typ === 'P',
        'exercise-conflict': this.classes.typ === 'C',
        'seminar-conflict': this.classes.typ === 'S',
        'laboratories-conflict': this.classes.typ === 'L',
        'lecture-conflict': this.classes.typ === 'W'
      };
    } else {
      return {
        'project': this.classes.typ === 'P',
        'exercise': this.classes.typ === 'C',
        'seminar': this.classes.typ === 'S',
        'laboratories': this.classes.typ === 'L',
        'lecture': this.classes.typ === 'W'
      };
    }
  }
}
