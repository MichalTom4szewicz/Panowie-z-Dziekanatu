import { WeekDay } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CommunicationConstants } from 'src/app/constants/communication-constants';
import { Classes } from 'src/app/domain/classes';
import { Degree } from 'src/app/enums/degree';
import { Parity } from 'src/app/enums/parity';
import { Typ } from 'src/app/enums/typ';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {

  constructor(private http: HttpClient) { }

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
    ]);
  }

  public getClassesByWeekDay(weekDay: WeekDay): Observable<Classes[][]> {
    return this.http.get<Classes[][]>(CommunicationConstants.getFullDataApiAddress('/classes/weekDay/' + weekDay));
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
