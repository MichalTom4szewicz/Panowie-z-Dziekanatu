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

  public getClasses(weekDay: WeekDay): Observable<Classes[][]> {
    return of(
      [
        [ 
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
          }
        ],
        [
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
          }
        ]
      ]
    );;
  }

  public getClassesConflicts(weekDay: WeekDay): Observable<Map<string, [number, number][]>> {
    let map: Map<string, [number, number][]> = new Map([
      ['Z05-20a', [[1,0]]],
      ['Z05-20b', [[1,0]]],
      ['Z05-20c', [[0,0], [0,1]]]
    ]);
    return of(map);
  }

  public getClassesMap(weekDay: WeekDay): Observable<Map<string, [number, number]>> {
    let map: Map<string, [number, number]> = new Map([
      ['Z05-20a', [0,0]],
      ['Z05-20b', [0,1]],
      ['Z05-20c', [1,0]]
    ]);
    return of(map);
  }
}
