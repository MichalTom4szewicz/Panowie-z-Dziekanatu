import { Component, Input, OnInit } from '@angular/core';
import { Typ } from 'src/app/enums/typ';
import { CalendarUtils } from 'src/app/utils/calendar-utils';
import { ClassesStatusEnum } from 'src/app/enums/classes-status-enum';
import { ClassesWithStatus } from 'src/app/helpers/classes-with-status';
import { MatDialog } from '@angular/material/dialog';
import { ClassesDetailsDialogComponent } from './classes-details-dialog/classes-details-dialog.component';

@Component({
  selector: 'pzd-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.sass']
})
export class ClassesComponent implements OnInit {

  @Input() classes: ClassesWithStatus;
  @Input() classesOddWeek?: ClassesWithStatus = undefined;
  @Input() clickable: boolean = false;
  private display: Map<ClassesStatusEnum, (classes: ClassesWithStatus) => any>;

  private static readonly STANDARD_CLASSES_DURATION: number = 105;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.display = new Map([
      [ClassesStatusEnum.SELECTED, (classes: ClassesWithStatus) => this.classesSelected(classes)],
      [ClassesStatusEnum.CONFLICT, (classes: ClassesWithStatus) => this.classesConflict(classes)],
      [ClassesStatusEnum.UNSELECTED, (classes: ClassesWithStatus) => this.classesUnselected(classes)],
      [ClassesStatusEnum.CREATE_SCHEDULE, (classes: ClassesWithStatus) => this.classesCreateSchedule(classes)],
      [ClassesStatusEnum.PENDING, (classes: ClassesWithStatus) => this.classesPending(classes)],
      [ClassesStatusEnum.ACCEPTED, (classes: ClassesWithStatus) => this.classesAccepted(classes)],
      [ClassesStatusEnum.REJECTED, (classes: ClassesWithStatus) => this.classesRejected(classes)]
    ]);
  }

  public openDialog(classes: ClassesWithStatus): void {
     this.dialog.open(ClassesDetailsDialogComponent, {
      data: classes
    });
  }

  public elementDisplay(): ClassesDisplay {
    if (this.isDualDisplay()) {
      return ClassesDisplay.DUAL;
    } else if (this.clickable) {
      return ClassesDisplay.CLICKABLE;
    } else {
      return ClassesDisplay.NOT_CLICKABLE;
    }
  }

  private isDualDisplay(): boolean {
    return this.classesOddWeek !== undefined;
  }

  public dualDisplay(): ClassesDisplay {
    return ClassesDisplay.DUAL
  }

  public clickableDisplay(): ClassesDisplay {
    return ClassesDisplay.CLICKABLE
  }

  public notClickableDisplay(): ClassesDisplay {
    return ClassesDisplay.NOT_CLICKABLE
  }

  public getClass(classes: ClassesWithStatus) {
    return this.display.get(classes.status!)!(classes);
  }

  private duration(classes: ClassesWithStatus): number {
    return CalendarUtils.getTimeInMinutes(classes.classes.endTime) - CalendarUtils.getTimeInMinutes(classes.classes.startTime);
  }

  private classesSelected(classes: ClassesWithStatus): any {
    return {
      'project-selected': classes.classes.typ === Typ.PROJECT,
      'exercise-selected': classes.classes.typ === Typ.EXERCISE,
      'seminar-selected': classes.classes.typ === Typ.SEMINAR,
      'laboratories-selected': classes.classes.typ === Typ.LABORATORIES,
      'lecture-selected': classes.classes.typ === Typ.LECTURE,
      'pointer': this.clickable,
      'block-size': this.isDualDisplay()
    };
  }

  private classesConflict(classes: ClassesWithStatus): any {
    return {
      'project-conflict': classes.classes.typ === Typ.PROJECT,
      'exercise-conflict': classes.classes.typ === Typ.EXERCISE,
      'seminar-conflict': classes.classes.typ === Typ.SEMINAR,
      'laboratories-conflict': classes.classes.typ === Typ.LABORATORIES,
      'lecture-conflict': classes.classes.typ === Typ.LECTURE,
      'pointer': this.clickable,
      'block-size': this.isDualDisplay()
    };
  }

  private classesUnselected(classes: ClassesWithStatus): any {
    return {
      'project': classes.classes.typ === Typ.PROJECT,
      'exercise': classes.classes.typ === Typ.EXERCISE,
      'seminar': classes.classes.typ === Typ.SEMINAR,
      'laboratories': classes.classes.typ === Typ.LABORATORIES,
      'lecture': classes.classes.typ === Typ.LECTURE,
      'pointer': this.clickable,
      'block-size': this.isDualDisplay()
    };
  }

  private classesCreateSchedule(classes: ClassesWithStatus) {
    return {
      'project': classes.classes.typ === Typ.PROJECT,
      'exercise': classes.classes.typ === Typ.EXERCISE,
      'seminar': classes.classes.typ === Typ.SEMINAR,
      'laboratories': classes.classes.typ === Typ.LABORATORIES,
      'lecture': classes.classes.typ === Typ.LECTURE,
      'schedule': this.duration(classes) > ClassesComponent.STANDARD_CLASSES_DURATION,
      'schedule-small': this.duration(classes) <= ClassesComponent.STANDARD_CLASSES_DURATION,
      'pointer': this.clickable,
      'block-size': this.isDualDisplay()
    };
  }

  private classesPending(classes: ClassesWithStatus): any {
    return {
      'project-conflict': classes.classes.typ === Typ.PROJECT,
      'exercise-conflict': classes.classes.typ === Typ.EXERCISE,
      'seminar-conflict': classes.classes.typ === Typ.SEMINAR,
      'laboratories-conflict': classes.classes.typ === Typ.LABORATORIES,
      'lecture-conflict': classes.classes.typ === Typ.LECTURE,
      'schedule': this.duration(classes) > ClassesComponent.STANDARD_CLASSES_DURATION,
      'schedule-small': this.duration(classes) <= ClassesComponent.STANDARD_CLASSES_DURATION,
      'pointer': this.clickable,
      'block-size': this.isDualDisplay()
    };
  }

  private classesAccepted(classes: ClassesWithStatus): any {
    return this.classesCreateSchedule(classes);
  }

  private classesRejected(classes: ClassesWithStatus): any {
    return {
      'rejected': true,
      'schedule': this.duration(classes) > ClassesComponent.STANDARD_CLASSES_DURATION,
      'schedule-small': this.duration(classes) <= ClassesComponent.STANDARD_CLASSES_DURATION,
      'pointer': this.clickable,
      'block-size': this.isDualDisplay()
    };
  }
}

enum ClassesDisplay {
  DUAL, CLICKABLE, NOT_CLICKABLE
}
