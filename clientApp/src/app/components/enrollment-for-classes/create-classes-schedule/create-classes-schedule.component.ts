import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { Classes } from 'src/app/domain/classes';
import { ClassGridService } from 'src/app/services/class-grid/class-grid.service';
import { ScheduleRegisterService } from 'src/app/services/schedule-register/schedule-register.service';
import { SchedulesMenagerService } from 'src/app/services/schedules-menager/schedules-menager.service';
import { SaveScheduleDialogComponent } from 'src/app/components/enrollment-for-classes/create-classes-schedule/save-schedule-dialog/save-schedule-dialog.component';
import { SavedSchedulesComponent } from 'src/app/components/enrollment-for-classes/create-classes-schedule/saved-schedules/saved-schedules.component';
import { ClassesWithStatus } from 'src/app/helpers/classes-with-status';
import { ClassesUtils } from 'src/app/utils/classes-utils';
import { ClassesStatusEnum } from 'src/app/enums/classes-status-enum';

@Component({
  selector: 'pzd-create-classes-schedule',
  templateUrl: './create-classes-schedule.component.html',
  styleUrls: ['./create-classes-schedule.component.sass']
})
export class CreateClassesScheduleComponent implements OnInit {
  
  private schedule: BehaviorSubject<ClassesWithStatus[][]> = new BehaviorSubject<ClassesWithStatus[][]>([]);
  scheduleChange: Observable<ClassesWithStatus[][]> = this.schedule.asObservable();

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
      value => this.schedule.next(
        value.map(
          row => row.map(
            classes => ClassesUtils.getClassesWithStatus(classes, ClassesStatusEnum.CREATE_SCHEDULE)
          )
        )
      )
    );
  }

  public registerForClasses(): void {
    this.scheduleRegisterService.register(this.getSchedule());
    this.openSnackbar('Zapisano na kursy');
  }

  public saveSchedule(): void {
    this.schedulesMenagerService.getSchedulesSaved().subscribe(savedSchedules => {
      this.openDialog(savedSchedules).subscribe(name => {
        if (name !== undefined && name !== '') {
          this.schedulesMenagerService.saveSchedule(this.getSchedule(), name).subscribe();
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
    return this.schedule.value.reduce((acc, val) => acc.concat(val), []).map(value => value.classes);
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
}
