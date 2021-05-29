import { Component, Input, OnInit } from '@angular/core';
import { Observable, range } from 'rxjs';
import { CalendarConstants } from 'src/app/constants/calendar-constants';
import { ClassesStatusEnum } from 'src/app/enums/classes-status-enum';
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

  private prepareGrid(schedule: ClassesWithStatus[]): ClassesGrid[] {
    let lastIndex: number = 0;
    var result: ClassesGrid[] = [];
    schedule.forEach(element => {
      let emptyGrid: ClassesGrid = {
        rows: CalendarUtils.getTimeInMinutes(element.classes.startTime) - lastIndex - CalendarConstants.CLASS_GRID_BEGINING_IN_MINUTES,
        isNotEmpty: false,
        classes: this.getEmptyClassesWithStatus()
      };
      let classesGrid: ClassesGrid = {
        rows: CalendarUtils.getTimeInMinutes(element.classes.endTime) - CalendarUtils.getTimeInMinutes(element.classes.startTime),
        isNotEmpty: true,
        classes: element
      };
      lastIndex = CalendarUtils.getTimeInMinutes(element.classes.endTime) - CalendarConstants.CLASS_GRID_BEGINING_IN_MINUTES;
      result = [...result, emptyGrid, classesGrid];
    });
    let emptyGrid: ClassesGrid = {
      rows: CalendarConstants.MINUTES_CLASS_GRID - lastIndex,
      isNotEmpty: false,
      classes: this.getEmptyClassesWithStatus()
    };
    return [...result, emptyGrid];
  }

  private getEmptyClassesWithStatus(): ClassesWithStatus {
    return { classes: ClassesUtils.getEmptyClasses(), status: ClassesStatusEnum.UNSELECTED };
  }
}
