import { Time, WeekDay } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { range } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Classes } from 'src/app/domain/classes';
import { ClassGridService } from 'src/app/services/class-grid/class-grid.service';
import { ClassesService } from 'src/app/services/classes/classes.service';
import { CalendarUtils } from 'src/app/utils/calendar-utils';
import { CalendarConstants } from '../../../constants/calendar-constants';
import { ClassesStatusEnum } from '../../../enums/classes-status-enum';
import { ReplaceClassesDialogComponent } from './replace-classes-dialog/replace-classes-dialog.component';

@Component({
  selector: 'pzd-class-grid-day',
  templateUrl: './class-grid-day.component.html',
  styleUrls: ['./class-grid-day.component.sass']
})
export class ClassGridDayComponent implements OnInit {
  
  @Input() weekDay: WeekDay;
  sortedClasses: [Classes, ClassesStatusEnum][][];
  selectedClasses: Set<Classes> = new Set();
  conflicts: Map<string, [number, number][]>;
  classesMap: Map<string, [number, number]>;
  hours: number[] = [];

  constructor(public dialog: MatDialog, private classesService: ClassesService, private classGridService: ClassGridService) { }

  ngOnInit(): void {
    range(7, 15).subscribe(hour => this.hours.push(hour));
    this.classesService.getClassesByWeekDay(this.weekDay).subscribe(value =>
      this.sortedClasses = value.map(row =>
        row.map(element =>
          [element, ClassesStatusEnum.UNSELECTED]
        )
      )
    );
    this.classesService.getClassesConflicts(this.weekDay).subscribe(value => this.conflicts = value);
    this.classesService.getClassesMap(this.weekDay).subscribe(value => this.classesMap = value);
    this.classGridService.scheduleLoadedChange.subscribe(() => this.updateSelectedAfterLoad());
  }

  private updateSelectedAfterLoad(): void {
    this.sortedClasses.forEach(row => row.forEach(element => element[1] = ClassesStatusEnum.UNSELECTED));
    this.classGridService.classGridChange.subscribe(grid => {
      let weekDayClasses = grid[CalendarConstants.WEEK_DAYS_ORDER.get(this.weekDay)!];
      this.selectedClasses = new Set(weekDayClasses);
      weekDayClasses.forEach(classes => {
        this.findClassesAndMarkAsSelected(classes.groupKey);
        this.addConflicts(classes.groupKey);
      });
    });
  }

  private findClassesAndMarkAsSelected(groupKey: string): void {
    let cordinate: [number, number] = this.classesMap.get(groupKey)!;
    this.sortedClasses[cordinate[0]][cordinate[1]][1] = ClassesStatusEnum.SELECTED;
  }

  public getHour(hour: number): string {
    return CalendarUtils.getFullHour(hour);
  }

  public getPosition(classes: Classes): { width: string; left: string; } {
    let relativeStartTime: number = (classes.startTime.hours - CalendarConstants.START_HOUR) * CalendarConstants.MINUTES_IN_HOUR + classes.startTime.minutes;
    let durationTime: number = this.getClassesDurationTime(classes.startTime, classes.endTime);
    let leftPercent: number = relativeStartTime / CalendarConstants.MINUTES_CLASS_GRID * 100;
    let widthPercent: number = durationTime / CalendarConstants.MINUTES_CLASS_GRID * 100;
    let left = leftPercent + CalendarConstants.PRECENT;
    let width = widthPercent + CalendarConstants.PRECENT;
    return {'width': width, 'left': left};
  }

  private getClassesDurationTime(start: Time, end: Time): number {
    let minutes: number = end.minutes - start.minutes;
    let result: number = (end.hours - start.hours) * CalendarConstants.MINUTES_IN_HOUR + minutes;
    return result;
  }

  public getWeekDay(): string {
    return CalendarConstants.WEEK_DAYS[CalendarConstants.WEEK_DAYS_ORDER.get(this.weekDay)!];
  }
  
  public select(classes: [Classes, ClassesStatusEnum]) {
    if (classes[1] === ClassesStatusEnum.SELECTED) {
      this.classGridService.removeElement(classes[0]);
      this.selectedClasses.delete(classes[0]);
      classes[1] = ClassesStatusEnum.UNSELECTED;
      this.removeConflicts(classes[0].groupKey);
    } else if (classes[1] === ClassesStatusEnum.CONFLICT) {
      let conflictClasses: [Classes, ClassesStatusEnum][] = this.getConflictClasses(classes[0]);
      this.openDialog(conflictClasses.map(v => v[0])).subscribe(add =>{
        if (add) {
          conflictClasses.forEach(element => {
            this.classGridService.removeElement(element[0])
            this.selectedClasses.delete(element[0]);
            this.removeConflicts(element[0].groupKey);
            element[1] = ClassesStatusEnum.UNSELECTED;
          });
          this.classGridService.addElement(classes[0]);
          this.selectedClasses.add(classes[0]);
          classes[1] = ClassesStatusEnum.SELECTED;
          this.addConflicts(classes[0].groupKey);
        }
      });
    } else {
      this.classGridService.addElement(classes[0]);
      this.selectedClasses.add(classes[0]);
      classes[1] = ClassesStatusEnum.SELECTED;
      this.addConflicts(classes[0].groupKey);
    }
  }

  private openDialog(conflictClasses: Classes[]): Observable<boolean> {
    const dialogRef = this.dialog.open(ReplaceClassesDialogComponent, {
      width: '300px',
      data: conflictClasses
    });
    return dialogRef.afterClosed();
  }

  private addConflicts(groupKey: string): void {
    this.conflicts.get(groupKey)?.forEach(element => this.sortedClasses[element[0]][element[1]][1] = ClassesStatusEnum.CONFLICT);
  }

  private removeConflicts(groupKey: string): void {
    this.conflicts.get(groupKey)?.forEach(element => {
      var conflictToDelete: boolean = true;
      let connectionsForConflict: [number, number][] = this.conflicts.get(this.sortedClasses[element[0]][element[1]][0].groupKey)!;
      connectionsForConflict.forEach(connection => {
        if (this.selectedClasses.has(this.sortedClasses[connection[0]][connection[1]][0])) {
          conflictToDelete = false;
        }
      });
      if (conflictToDelete) {
        this.sortedClasses[element[0]][element[1]][1] = ClassesStatusEnum.UNSELECTED;
      }
    });
  }

  private getConflictClasses(classes: Classes): [Classes, ClassesStatusEnum][] {
    var result: [Classes, ClassesStatusEnum][] = [];
    this.conflicts.get(classes.groupKey)?.forEach(element => {
      if (this.selectedClasses.has(this.sortedClasses[element[0]][element[1]][0])) {
        result = [ ...result, this.sortedClasses[element[0]][element[1]]];
      }
    });
    return result;
  }
}
