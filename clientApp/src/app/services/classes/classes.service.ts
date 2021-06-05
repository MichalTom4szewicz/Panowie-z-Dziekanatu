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
export class ClassesService {

  constructor() { }

  public getClassesByCourse(courseKey: string): Observable<Classes[]> {
    return of([ 
      {
        weekDay: WeekDay.Monday,
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
          name: 'Zastosowania Inform. w Gospod.',
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
        host: {
          firstName: 'Max',
          lastName: 'Mustermann',
          degree: Degree.ENG,
          username: 'mmustermann'
        },
        building: 'C-1',
        room: '104',
        groupKey: 'Z05-20b',
        course: {
          name: 'Zastosowania Inform. w Gospod.',
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
      }
    ]);
  }

  public getClassesByWeekDay(weekDay: WeekDay): Observable<Classes[][]> {
    return of(
      [
        [ 
          {
            weekDay: weekDay,
            startTime: {
              hours: 11,
              minutes: 15
            },
            endTime: {
              hours: 13,
              minutes: 0
            },
            host: undefined,
            building: 'C-1',
            room: '104',
            groupKey: 'Z05-20d',
            course: {
              name: 'Zastosowania Inform. w Gospod.',
              courseKey: 'INZ000011',
              supervisor: {
                firstName: 'Tomasz',
                lastName: 'Szandała',
                degree: Degree.DR_ENG,
                username: 'tszandala'
              }
            },
            typ: Typ.LABORATORIES,
            parity: Parity.EVEN
          }, 
          {
            weekDay: weekDay,
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
              name: 'Zastosowania Inform. w Gospod.',
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
          },
          {
            weekDay: weekDay,
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
              name: 'Zastosowania Inform. w Gospod.',
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
          }
        ],
        [ 
          {
            weekDay: weekDay,
            startTime: {
              hours: 11,
              minutes: 15
            },
            endTime: {
              hours: 13,
              minutes: 0
            },
            host: undefined,
            building: 'C-1',
            room: '104',
            groupKey: 'Z05-20e',
            course: {
              name: 'Zastosowania Inform. w Gospod.',
              courseKey: 'INZ000011',
              supervisor: {
                firstName: 'Tomasz',
                lastName: 'Szandała',
                degree: Degree.DR_ENG,
                username: 'tszandala'
              }
            },
            typ: Typ.SEMINAR,
            parity: Parity.ODD
          },
          {
            weekDay: weekDay,
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
              name: 'Zastosowania Inform. w Gospod.',
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
          }
        ]
      ]
    );
  }

  public getClassesConflicts(weekDay: WeekDay): Observable<Map<string, [number, number][]>> {
    let map: Map<string, [number, number][]> = new Map([
      ['Z05-20a', [[1,1]]],
      ['Z05-20b', [[1,1]]],
      ['Z05-20c', [[0,1], [0,2]]],
      ['Z05-20d', []],
      ['Z05-20e', []],
    ]);
    return of(map);
  }

  public getClassesMap(weekDay: WeekDay): Observable<Map<string, [number, number]>> {
    let map: Map<string, [number, number]> = new Map([
      ['Z05-20d', [0,0]],
      ['Z05-20a', [0,1]],
      ['Z05-20b', [0,2]],
      ['Z05-20e', [1,0]],
      ['Z05-20c', [1,1]]
    ]);
    return of(map);
  }

  public addClasses(classes: Classes): Observable<boolean> {
    return of(true);
  }

  public updateClasses(classes: Classes): Observable<boolean> {
    return of(true);
  }

  public deleteClasses(classes: Classes): Observable<boolean> {
    return of(true);
  }
}
