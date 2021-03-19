import { Time, WeekDay } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { range } from 'rxjs';
import { Classes } from 'src/app/domain/classes';
import { ClassesService } from 'src/app/services/classes/classes.service';

@Component({
  selector: 'pzd-class-grid-day',
  templateUrl: './class-grid-day.component.html',
  styleUrls: ['./class-grid-day.component.sass']
})
export class ClassGridDayComponent implements OnInit {
  
  @Input() weekDay: WeekDay;
  sortedClasses: Classes[][];
  hours: number[] = [];

  private readonly minutesClassGrid: number = 840;
  private readonly minutesInHour: number = 60;
  private readonly startHour: number = 7;
  private readonly percent: string = '%'; 

  private weekDayMap: Map<WeekDay, string> = new Map([
    [WeekDay.Monday, 'Poniedziałek'],
    [WeekDay.Tuesday, 'Wtorek'],
    [WeekDay.Wednesday, 'Środa'],
    [WeekDay.Thursday, 'Czwartek'],
    [WeekDay.Friday, 'Piątek'],
    [WeekDay.Saturday, 'Sobota'],
    [WeekDay.Sunday, 'Niedziela']
  ]);
  
  constructor(private classesService: ClassesService) { }

  ngOnInit(): void {
    range(7, 15).subscribe(hour => this.hours.push(hour));
    this.classesService.getClasses(this.weekDay).subscribe(value => this.sortedClasses = value);
  }

  public getHour(hour: number): string {
    return hour.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    }) + ":00";
  }

  public getPosition(classes: Classes): { width: string; left: string; } {
    let relativeStartTime: number = (classes.startTime.hours - this.startHour) * this.minutesInHour + classes.startTime.minutes;
    let durationTime: number = this.getClassesDurationTime(classes.startTime, classes.endTime);
    let leftPercent: number = relativeStartTime / this.minutesClassGrid * 100;
    let widthPercent: number = durationTime / this.minutesClassGrid * 100;
    let left = leftPercent + this.percent;
    let width = widthPercent + this.percent;
    return {'width': width, 'left': left};
  }

  private getClassesDurationTime(start: Time, end: Time): number {
    let minutes: number = end.minutes - start.minutes;
    let result: number = (end.hours - start.hours) * this.minutesInHour + minutes;
    return result;
  }

  public getWeekDay(): string {
    return this.weekDayMap.get(this.weekDay)!;
  }
  
  select() {
    
  }
}
