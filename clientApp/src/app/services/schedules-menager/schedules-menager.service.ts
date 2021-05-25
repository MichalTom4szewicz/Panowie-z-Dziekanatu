import { WeekDay } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Classes } from 'src/app/domain/classes';
import { Degree } from 'src/app/enums/degree';
import { Parity } from 'src/app/enums/parity';
import { Typ } from 'src/app/enums/typ';

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
          weekDay: WeekDay.Monday,
          startTime: {
            hours: 18,
            minutes: 0
          },
          endTime: {
            hours: 20,
            minutes: 35
          },
          host: undefined,
          building: 'C-1',
          room: '104',
          groupKey: 'Z05-20c',
          course: {
            name: 'Zastosowania inform. w gospod.',
            courseKey: 'INZ000011',
            supervisor: {
              firstName: 'Tomasz',
              lastName: 'Szandała',
              degree: Degree.DR_ENG,
              username: 'tszandala'
            }
          },
          typ: Typ.LECTURE,
          parity: Parity.NONE
        },
        {
          weekDay: WeekDay.Thursday,
          startTime: {
            hours: 18,
            minutes: 55
          },
          endTime: {
            hours: 20,
            minutes: 35
          },
          host: undefined,
          building: 'C-1',
          room: '104',
          groupKey: 'Z05-20b',
          course: {
            name: 'Zastosowania inform. w gospod.',
            courseKey: 'INZ000011',
            supervisor: {
              firstName: 'Tomasz',
              lastName: 'Szandała',
              degree: Degree.DR_ENG,
              username: 'tszandala'
            }
          },
          typ: Typ.EXERCISE,
          parity: Parity.NONE
        },
        {
          weekDay: WeekDay.Thursday,
          startTime: {
            hours: 17,
            minutes: 5
          },
          endTime: {
            hours: 18,
            minutes: 45
          },
          host: undefined,
          building: 'C-1',
          room: '104',
          groupKey: 'Z05-20a',
          course: {
            name: 'Zastosowania inform. w gospod.',
            courseKey: 'INZ000011',
            supervisor: {
              firstName: 'Tomasz',
              lastName: 'Szandała',
              degree: Degree.DR_ENG,
              username: 'tszandala'
            }
          },
          typ: Typ.PROJECT,
          parity: Parity.NONE
        }
      ]);
    } else {
      return of([
        {
          weekDay: WeekDay.Friday,
          startTime: {
            hours: 18,
            minutes: 0
          },
          endTime: {
            hours: 20,
            minutes: 35
          },
          host: undefined,
          building: 'C-1',
          room: '104',
          groupKey: 'Z05-20c',
          course: {
            name: 'Zastosowania inform. w gospod.',
            courseKey: 'INZ000011',
            supervisor: {
              firstName: 'Tomasz',
              lastName: 'Szandała',
              degree: Degree.DR_ENG,
              username: 'tszandala'
            }
          },
          typ: Typ.LECTURE,
          parity: Parity.NONE
        },
        {
          weekDay: WeekDay.Tuesday,
          startTime: {
            hours: 18,
            minutes: 55
          },
          endTime: {
            hours: 20,
            minutes: 35
          },
          host: undefined,
          building: 'C-1',
          room: '104',
          groupKey: 'Z05-20b',
          course: {
            name: 'Zastosowania inform. w gospod.',
            courseKey: 'INZ000011',
            supervisor: {
              firstName: 'Tomasz',
              lastName: 'Szandała',
              degree: Degree.DR_ENG,
              username: 'tszandala'
            }
          },
          typ: Typ.EXERCISE,
          parity: Parity.NONE
        },
        {
          weekDay: WeekDay.Tuesday,
          startTime: {
            hours: 17,
            minutes: 5
          },
          endTime: {
            hours: 18,
            minutes: 45
          },
          host: undefined,
          building: 'C-1',
          room: '104',
          groupKey: 'Z05-20a',
          course: {
            name: 'Zastosowania inform. w gospod.',
            courseKey: 'INZ000011',
            supervisor: {
              firstName: 'Tomasz',
              lastName: 'Szandała',
              degree: Degree.DR_ENG,
              username: 'tszandala'
            }
          },
          typ: Typ.PROJECT,
          parity: Parity.NONE
        }
      ]);
    }
  }

  public saveSchedule(schedule: Classes[], name: string): void {
    // return http.post("url", {
    //   objects: schedule,
    //   name: name
    // })
  }
}
