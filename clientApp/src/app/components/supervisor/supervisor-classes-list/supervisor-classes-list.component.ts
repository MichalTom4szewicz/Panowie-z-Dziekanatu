import { Time, WeekDay } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Classes } from 'src/app/domain/classes';
import { Course } from 'src/app/domain/course';
import { Parity } from 'src/app/enums/parity';
import { ClassesService } from 'src/app/services/classes/classes.service';
import { CalendarUtils } from 'src/app/utils/calendar-utils';
import { ClassesUtils } from 'src/app/utils/classes-utils';
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
  classesList: [Classes, boolean, boolean][] = [];
  displayedColumns: string[] = ['weekDay', 'startTime', 'endTime', 'parity', 'building', 'room', 'groupKey', 'typ', 'host', 'buttons'];
  addButton: boolean = true;

  constructor(public dialog: MatDialog, private classesService: ClassesService) { }

  ngOnInit(): void {
    this.updateClassesList();
  }

  private updateClassesList(): void {
    this.classesService.getClassesByCourse(this.course.courseKey).subscribe(list => this.classesList = list.map(element => [element, true, true]));
  }

  public mouseover(element: [Classes, boolean, boolean], field: number): void {
    element[field] = false;
  }

  public mouseleave(element: [Classes, boolean, boolean], field: number): void {
    element[field] = true;
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
      if (update[0]) {
        this.classesService.updateClasses(update[1]).subscribe(() => {
          element.weekDay = update[1].weekDay;
          element.startTime = update[1].startTime;
          element.endTime = update[1].endTime;
          element.building = update[1].building;
          element.room = update[1].room;
          element.typ = update[1].typ;
          element.parity = update[1].parity;
        });
      }
    });
  }

  public delete(element: Classes): void {
    this.classesService.deleteClasses(element).subscribe(() => {
      this.classesList = this.classesList.filter(classes => classes[0] !== element);
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
      if (save[0]) {
        this.classesService.addClasses(save[1]).subscribe(() => {
          if (save[1].host === null) {
            save[1].host = undefined;
          }
          this.classesList = [...this.classesList, [save[1], true, true]];
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
}
