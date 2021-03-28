import { WeekDay } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { range } from 'rxjs';
import { Classes } from 'src/app/domain/classes';
import { ClassGridService } from 'src/app/services/class-grid/class-grid.service';
import { CalendarUtils } from 'src/app/utils/calendar-utils';
import { CalendarConstants } from '../../constants/calendar-constants';

@Component({
  selector: 'pzd-classes-schedule',
  templateUrl: './classes-schedule.component.html',
  styleUrls: ['./classes-schedule.component.sass']
})
export class ClassesScheduleComponent implements OnInit {
  
  weekDays: string[] = CalendarConstants.WEEK_DAYS;
  hours: number[] = [];
  schedule: ClassesGrid[][] = [];

  constructor(private classGridService: ClassGridService) { }

  ngOnInit(): void {
    this.classGridService.classGridChange.subscribe(
      value => this.schedule = value.map(
        daySchedule => this.prepareGrid(daySchedule)
      )
    );
    range(7, 14).subscribe(hour => this.hours.push(hour));
  }
  
  public getHour(hour: number): string {
    return CalendarUtils.getFullHour(hour);
  }

  private prepareGrid(schedule: Classes[]): ClassesGrid[] {
    let lastIndex: number = 0;
    var result: ClassesGrid[] = [];
    schedule.forEach(element => {
      let emptyGrid: ClassesGrid = {
        rows: CalendarUtils.getTimeInMinutes(element.startTime) - lastIndex - CalendarConstants.CLASS_GRID_BEGINING_IN_MINUTES,
        isNotEmpty: false,
        classes: this.getEmptyClass()
      };
      let classesGrid: ClassesGrid = {
        rows: CalendarUtils.getTimeInMinutes(element.endTime) - CalendarUtils.getTimeInMinutes(element.startTime),
        isNotEmpty: true,
        classes: element
      };
      lastIndex = CalendarUtils.getTimeInMinutes(element.endTime) - CalendarConstants.CLASS_GRID_BEGINING_IN_MINUTES;
      result = [...result, emptyGrid, classesGrid];
    });
    let emptyGrid: ClassesGrid = {
      rows: CalendarConstants.MINUTES_CLASS_GRID - lastIndex,
      isNotEmpty: false,
      classes: this.getEmptyClass()
    };
    return [...result, emptyGrid];
  }

  private getEmptyClass(): Classes {
    return {
      name: '',
      weekDay: WeekDay.Monday,
      startTime: {
        hours: 0,
        minutes: 0
      },
      endTime: {
        hours: 0,
        minutes: 0
      },
      host: '',
      building: '',
      room: '',
      groupKey: '',
      typ: ''
    }
  }
}

interface ClassesGrid {
  rows: number,
  isNotEmpty: boolean,
  classes: Classes
}
