import { WeekDay } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Classes } from 'src/app/domain/classes';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {

  constructor() { }

  private classes: Observable<Classes[][]> = of(
    [
      [ 
        {
          name: 'Zastosowania inform. w gospod.',
          weekDay: WeekDay.Monday,
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
        },
        {
          name: 'Zastosowania inform. w gospod.',
          weekDay: WeekDay.Monday,
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
          groupKey: 'Z05-20a',
          typ: 'P'
        }
      ],
      [
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
          groupKey: 'Z05-20a',
          typ: 'W'
        }
      ]
    ]
  );

  public getClasses(weekDay: WeekDay): Observable<Classes[][]> {
    return this.classes;
  }
}
