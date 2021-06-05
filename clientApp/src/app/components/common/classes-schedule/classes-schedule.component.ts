import { Component, Input, OnInit } from '@angular/core';
import { Observable, range } from 'rxjs';
import { CalendarConstants } from 'src/app/constants/calendar-constants';
import { ClassesStatusEnum } from 'src/app/enums/classes-status-enum';
import { Parity } from 'src/app/enums/parity';
import { ClassesGrid } from 'src/app/helpers/class-grid';
import { ClassesWithStatus } from 'src/app/helpers/classes-with-status';
import { CalendarUtils } from 'src/app/utils/calendar-utils';
import { ClassesUtils } from 'src/app/utils/classes-utils';

@Component({
  selector: 'pzd-classes-schedule',
  templateUrl: './classes-schedule.component.html',
  styleUrls: ['./classes-schedule.component.sass']
})
export class ClassesScheduleComponent implements OnInit {

  @Input() schedule: Observable<ClassesWithStatus[][]>;
  scheduleGrid: ClassesGrid[][] = [];
  weekDays: string[] = CalendarConstants.WEEK_DAYS;
  hours: number[] = [];

  constructor() { }

  ngOnInit(): void {
    this.schedule.subscribe(
      value => this.scheduleGrid = value.map(
        daySchedule => this.prepareGrid(daySchedule)
      )
    );
    range(7, 14).subscribe(hour => this.hours.push(hour));
  }
  
  public getHour(hour: number): string {
    return CalendarUtils.getFullHour(hour);
  }

  public isClickable(classes: ClassesGrid): boolean {
    return classes.classesOddWeek !== undefined;
  }

  private prepareGrid(schedule: ClassesWithStatus[]): ClassesGrid[] {
    let lastIndex: number = 0;
    let result: ClassesGrid[] = [];
    schedule.forEach(element => {
      if (result.length > 0 && this.isDual(element, result[result.length - 1].classes)) {
        if (element.classes.parity === Parity.ODD) {
          result[result.length - 1].classesOddWeek = element;
        } else {
          result[result.length - 1].classesOddWeek = result[result.length - 1].classes;
          result[result.length - 1].classes = element;
        }
      } else {
        let emptyGrid: ClassesGrid = this.createEmptyGrid(element, lastIndex);
        let classesGrid: ClassesGrid = this.createNewGrid(element);
        lastIndex = CalendarUtils.getTimeInMinutes(element.classes.endTime) - CalendarConstants.CLASS_GRID_BEGINING_IN_MINUTES;
        result = [...result, emptyGrid, classesGrid];
      }
    });
    const rows: number = CalendarConstants.MINUTES_CLASS_GRID - lastIndex;
    let emptyGrid: ClassesGrid = this.createGrid(rows, false, this.getEmptyClassesWithStatus());
    return [...result, emptyGrid];
  }

  private isDual(firstElement: ClassesWithStatus, secondElement: ClassesWithStatus): boolean {
    return firstElement.classes.startTime.hours === secondElement.classes.startTime.hours
      && firstElement.classes.startTime.minutes === secondElement.classes.startTime.minutes;
  }

  private createNewGrid(element: ClassesWithStatus): ClassesGrid {
    const rows: number = CalendarUtils.getTimeInMinutes(element.classes.endTime) - CalendarUtils.getTimeInMinutes(element.classes.startTime);
    return this.createGrid(rows, true, element);
  }

  private createEmptyGrid(element: ClassesWithStatus, lastIndex: number): ClassesGrid {
    const rows: number = CalendarUtils.getTimeInMinutes(element.classes.startTime) - lastIndex - CalendarConstants.CLASS_GRID_BEGINING_IN_MINUTES;
    return this.createGrid(rows, false, this.getEmptyClassesWithStatus());
  }

  private createGrid(rows: number, isNotEmpty: boolean, classes: ClassesWithStatus): ClassesGrid {
    return {
      rows: rows,
      isNotEmpty: isNotEmpty,
      classes: classes
    };
  }

  private getEmptyClassesWithStatus(): ClassesWithStatus {
    return { classes: ClassesUtils.getEmptyClasses(), status: ClassesStatusEnum.UNSELECTED };
  }
}
