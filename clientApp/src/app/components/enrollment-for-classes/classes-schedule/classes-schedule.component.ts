import { WeekDay } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of, range } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Classes } from 'src/app/domain/classes';
import { ClassGridService } from 'src/app/services/class-grid/class-grid.service';
import { ScheduleRegisterService } from 'src/app/services/schedule-register/schedule-register.service';
import { SchedulesMenagerService } from 'src/app/services/schedules-menager/schedules-menager.service';
import { CalendarUtils } from 'src/app/utils/calendar-utils';
import { CalendarConstants } from '../../constants/calendar-constants';
import { SaveScheduleDialogComponent } from './save-schedule-dialog/save-schedule-dialog.component';
import { SavedSchedulesComponent } from './saved-schedules/saved-schedules.component';

@Component({
  selector: 'pzd-classes-schedule',
  templateUrl: './classes-schedule.component.html',
  styleUrls: ['./classes-schedule.component.sass']
})
export class ClassesScheduleComponent implements OnInit {
  
  weekDays: string[] = CalendarConstants.WEEK_DAYS;
  hours: number[] = [];
  schedule: ClassesGrid[][] = [];

  constructor(
    private classGridService: ClassGridService,
    private schedulesMenagerService: SchedulesMenagerService,
    private scheduleRegisterService: ScheduleRegisterService,
    private _bottomSheet: MatBottomSheet,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.classGridService.classGridChange.subscribe(
      value => this.schedule = value.map(
        daySchedule => this.prepareGrid(daySchedule)
      )
    );
    range(7, 14).subscribe(hour => this.hours.push(hour));
  }

  public registerForClasses(): void {
    this.scheduleRegisterService.register(this.getSchedule());
    this.openSnackbar('Zapisano na kursy');
  }

  public saveSchedule(): void {
    this.schedulesMenagerService.getSchedulesSaved().subscribe(savedSchedules => {
      this.openDialog(savedSchedules).subscribe(name => {
        if (name !== undefined && name !== '') {
          this.schedulesMenagerService.saveSchedule(this.getSchedule(), name);
          this.openSnackbar('Zapisano plan o nazwie: ' + name);
        }
      });
    });
  }

  private openDialog(schedules: string[]): Observable<string> {
    const dialogRef = this.dialog.open(SaveScheduleDialogComponent, {
      width: '400px',
      data: schedules
    });
    return dialogRef.afterClosed();
  }

  private getSchedule(): Classes[] {
    return this.schedule.reduce((acc, val) => acc.concat(val), []).map(element => element.classes);
  }

  public openSavedSchedulesComponent(): void {
    this.schedulesMenagerService.getSchedulesSaved().subscribe(savedSchedules => {
      if (savedSchedules.length === 0) {
        this.openSnackbar('Nie posiadasz żadnego zapisanego planu.');
      } else {
        this.openBottomSheet(savedSchedules);
      }
    });
  }

  private openSnackbar(text: string): void {
    this._snackBar.open(text, '', { duration: 4000 });
  }

  private openBottomSheet(savedSchedules: string[]): void {
    this._bottomSheet.open(SavedSchedulesComponent, {
      data: { schedules: savedSchedules }
    }).afterDismissed().subscribe(scheduleName => {
      this.schedulesMenagerService.getSchedule(scheduleName).subscribe(schedule => {
        this.classGridService.addSchedule(schedule);
      });
    });
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
