import { WeekDay } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Classes } from 'src/app/domain/classes';

@Injectable({
  providedIn: 'root'
})
export class SchedulesMenagerService {

  schedulesList: boolean = true;
  scheduleBoolean: boolean = true;

  constructor() { }

  public getSchedulesSaved(): Observable<string[]> {
    this.schedulesList = !this.schedulesList;
    if (this.schedulesList) {
      return of(['Mój super plan', 'Jeszcze lepszy plan', 'A to juz jest naprawde cacy']);
    } else {
      return of([]);
    }
  }

  public getSchedule(schedule: string): Observable<Classes[]> {
    this.scheduleBoolean = !this.scheduleBoolean;
    if (this.scheduleBoolean) {
      return of([
        {
          name: 'Zastosowania inform. w gospod.',
          weekDay: WeekDay.Monday,
          startTime: {
            hours: 18,
            minutes: 0
          },
          endTime: {
            hours: 20,
            minutes: 35
          },
          host: 'Mgr inż. Tomasz Szandała',
          building: 'C-1',
          room: '104',
          groupKey: 'Z05-20c',
          typ: 'W'
        },
        {
          name: 'Zastosowania inform. w gospod.',
          weekDay: WeekDay.Thursday,
          startTime: {
            hours: 18,
            minutes: 55
          },
          endTime: {
            hours: 20,
            minutes: 35
          },
          host: 'Mgr inż. Tomasz Szandała',
          building: 'C-1',
          room: '104',
          groupKey: 'Z05-20b',
          typ: 'C'
        },
        {
          name: 'Zastosowania inform. w gospod.',
          weekDay: WeekDay.Thursday,
          startTime: {
            hours: 17,
            minutes: 5
          },
          endTime: {
            hours: 18,
            minutes: 45
          },
          host: 'Mgr inż. Tomasz Szandała',
          building: 'C-1',
          room: '104',
          groupKey: 'Z05-20a',
          typ: 'P'
        }
      ]);
    } else {
      return of([
        {
          name: 'Zastosowania inform. w gospod.',
          weekDay: WeekDay.Friday,
          startTime: {
            hours: 18,
            minutes: 0
          },
          endTime: {
            hours: 20,
            minutes: 35
          },
          host: 'Mgr inż. Tomasz Szandała',
          building: 'C-1',
          room: '104',
          groupKey: 'Z05-20c',
          typ: 'W'
        },
        {
          name: 'Zastosowania inform. w gospod.',
          weekDay: WeekDay.Tuesday,
          startTime: {
            hours: 18,
            minutes: 55
          },
          endTime: {
            hours: 20,
            minutes: 35
          },
          host: 'Mgr inż. Tomasz Szandała',
          building: 'C-1',
          room: '104',
          groupKey: 'Z05-20b',
          typ: 'C'
        },
        {
          name: 'Zastosowania inform. w gospod.',
          weekDay: WeekDay.Tuesday,
          startTime: {
            hours: 17,
            minutes: 5
          },
          endTime: {
            hours: 18,
            minutes: 45
          },
          host: 'Mgr inż. Tomasz Szandała',
          building: 'C-1',
          room: '104',
          groupKey: 'Z05-20a',
          typ: 'P'
        }
      ]);
    }
  }

  public saveSchedule(schedule: Classes[], name: string): void {

  }
}
