import { Time, WeekDay } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Classes } from 'src/app/domain/classes';
import { Course } from 'src/app/domain/course';
import { Parity } from 'src/app/enums/parity';
import { ClassesService } from 'src/app/services/classes/classes.service';
import { CalendarUtils } from 'src/app/utils/calendar-utils';
import { ClassesUtils } from 'src/app/utils/classes-utils';
import { UserUtils } from 'src/app/utils/user-utils';
import { CalendarConstants } from '../../../constants/calendar-constants';
import { HostingRequestsDialogComponent } from './hosting-requests-dialog/hosting-requests-dialog.component';
import { ManageClassesDialogComponent } from './manage-classes-dialog/manage-classes-dialog.component';

@Component({
  selector: 'pzd-supervisor-classes-list',
  templateUrl: './supervisor-classes-list.component.html',
  styleUrls: ['./supervisor-classes-list.component.sass']
})
export class SupervisorClassesListComponent implements OnInit {

  @Input() course: Course;
  classesList: ClassesDisplay[] = [];
  displayedColumns: string[] = ['weekDay', 'startTime', 'endTime', 'parity', 'building', 'room', 'groupKey', 'typ', 'host', 'buttons'];
  addButton: boolean = true;

  constructor(public dialog: MatDialog, private classesService: ClassesService) { }

  ngOnInit(): void {
    this.updateClassesList();
  }

  private updateClassesList(): void {
    this.classesService.getClassesByCourse(this.course.courseKey).subscribe(list => this.classesList = list.map(element => this.getClassesDisplay(element)));
  }

  public mouseover(classesDisplay: ClassesDisplay, edit: boolean): void {
    if (edit) {
      classesDisplay.mouseoverEdit = true;
    } else {
      classesDisplay.mouseoverDelete = true;
    }
  }

  public mouseleave(classesDisplay: ClassesDisplay, edit: boolean): void {
    if (edit) {
      classesDisplay.mouseoverEdit = false;
    } else {
      classesDisplay.mouseoverDelete = false;
    }
  }

  public edit(element: Classes): void {
    let copy: Classes = ClassesUtils.copyClasses(element);
    this.dialog.open(ManageClassesDialogComponent, {
      width: '300px',
      data: {
        classes: copy,
        edit: true
      }
    }).afterClosed().subscribe(update => {
      if (update.isSaved) {
        this.classesService.updateClasses(update.classes).subscribe(() => {
          element.weekDay = update.classes.weekDay;
          element.startTime = update.classes.startTime;
          element.endTime = update.classes.endTime;
          element.building = update.classes.building;
          element.room = update.classes.room;
          element.typ = update.classes.typ;
          element.parity = update.classes.parity;
        });
      }
    });
  }

  public delete(element: Classes): void {
    this.classesService.deleteClasses(element).subscribe(() => {
      this.classesList = this.classesList.filter(classes => classes.classes !== element);
    });
  }

  public add(): void {
    let classes: Classes = ClassesUtils.getEmptyClassesWithCourse(this.course);
    this.dialog.open(ManageClassesDialogComponent, {
      width: '300px',
      data: {
        classes: classes,
        edit: false
      }
    }).afterClosed().subscribe(save => {
      if (save.isSaved) {
        this.classesService.addClasses(save.classes).subscribe(() => {
          if (save.classes.host === null) {
            save.classes.host = undefined;
          }
          this.classesList = [...this.classesList, this.getClassesDisplay(save.classes)];
        });
      }
    });
  }

  public mouseoverAddButton(): void {
    this.addButton = false;
  }

  public mouseleaveAddButton(): void {
    this.addButton = true;
  }

  public selectHost(classes: Classes): void {
    this.dialog.open(HostingRequestsDialogComponent, {
      width: '300px',
      data: classes
    }).afterClosed().subscribe(host => classes.host = host);
  }
  
  public getTime(time: Time): string {
    return CalendarUtils.getTime(time);
  }

  public getWeekDayName(weekDay: WeekDay): string {
    return CalendarConstants.WEEK_DAYS[CalendarConstants.WEEK_DAYS_ORDER.get(weekDay)!];
  }

  public getParity(parity: Parity): string {
    if (parity === Parity.EVEN) {
      return 'Parzysty';
    } else if (parity === Parity.ODD) {
      return 'Nieparzysty';
    } else {
      return 'Co tydzień';
    }
  }

  public displayUser(classes: Classes): string {
    return UserUtils.displayUser(classes.host!);
  }

  private getClassesDisplay(classes: Classes): ClassesDisplay {
    return {
      classes: classes,
      mouseoverEdit: false,
      mouseoverDelete: false
    }
  }
}

interface ClassesDisplay {
  classes: Classes,
  mouseoverEdit: boolean,
  mouseoverDelete: boolean
}
