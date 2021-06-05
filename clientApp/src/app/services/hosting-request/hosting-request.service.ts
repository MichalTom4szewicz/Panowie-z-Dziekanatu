import { WeekDay } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { CommunicationConstants } from 'src/app/constants/communication-constants';
import { RestConstants } from 'src/app/constants/rest-constants';
import { Classes } from 'src/app/domain/classes';
import { HostingRequest } from 'src/app/domain/hosting-request';
import { Degree } from 'src/app/enums/degree';
import { Parity } from 'src/app/enums/parity';
import { Status } from 'src/app/enums/status';
import { Typ } from 'src/app/enums/typ';
import { ClassesUtils } from 'src/app/utils/classes-utils';

@Injectable({
  providedIn: 'root'
})
export class HostingRequestService {

  constructor(private http: HttpClient) { }

  public registerForClasses(schedule: Classes[]): Observable<boolean> {
    return this.http.post<boolean>(
      this.getUrl(RestConstants.PLAN),
      {
        objects: schedule
      }
    );
  }

  public deleteRejectedHostingRequests(): Observable<any> {
    return of([]);
  }

  public getRegisteredClasses(): Observable<HostingRequest[][]> {
    const class1: Classes = {
      weekDay: WeekDay.Friday,
      startTime: {
        hours: 7,
        minutes: 30
      },
      endTime: {
        hours: 9,
        minutes: 0
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
      typ: Typ.EXERCISE,
      parity: Parity.NONE
    };
    const class2: Classes = {
      weekDay: WeekDay.Friday,
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
      typ: Typ.LABORATORIES,
      parity: Parity.NONE
    };
    const class3: Classes = {
      weekDay: WeekDay.Friday,
      startTime: {
        hours: 13,
        minutes: 15
      },
      endTime: {
        hours: 15,
        minutes: 0
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
      typ: Typ.SEMINAR,
      parity: Parity.EVEN
    };
    const class3b: Classes = {
      weekDay: WeekDay.Friday,
      startTime: {
        hours: 13,
        minutes: 15
      },
      endTime: {
        hours: 15,
        minutes: 0
      },
      host: undefined,
      building: 'C-1',
      room: '104',
      groupKey: 'Z05-20c',
      course: {
        name: 'Zastosowania inform. w gospod.',
        courseKey: 'INZ000011',
        supervisor: {
          firstName: 'Zbigniew',
          lastName: 'Szpunar',
          degree: Degree.DR_ENG,
          username: 'zszpunar'
        }
      },
      typ: Typ.EXERCISE,
      parity: Parity.ODD
    };
    const class4: Classes = {
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
      typ: Typ.PROJECT,
      parity: Parity.NONE
    };
    return of([
      [
        {
          id: '1',
          status: Status.PENDING,
          user: {
            firstName: 'Tomasz',
            lastName: 'Szandała',
            degree: Degree.DR_ENG,
            username: 'tszandala'
          },
          class: class1
        },
        {
          id: '2',
          status: Status.ACCEPTED,
          user: {
            firstName: 'Janusz',
            lastName: 'Ratajczak',
            degree: Degree.DR_HAB_ENG,
            username: 'jratajczak'
          },
          class: class2
        },
        {
          id: '3',
          status: Status.ACCEPTED,
          user: {
            firstName: 'Paweł',
            lastName: 'Wichary',
            degree: Degree.MA_ENG,
            username: 'pwichary'
          },
          class: class3
        },
        {
          id: '4',
          status: Status.PENDING,
          user: {
            firstName: 'Paweł',
            lastName: 'Wichary',
            degree: Degree.MA_ENG,
            username: 'pwichary'
          },
          class: class3b
        },
        {
          id: '5',
          status: Status.PENDING,
          user: {
            firstName: 'Zbigniew',
            lastName: 'Szpunar',
            degree: Degree.DR_ENG,
            username: 'zszpunar'
          },
          class: class4
        }
      ],
      [

      ],
      [

      ],
      [
        {
          id: '3',
          status: Status.PENDING,
          user: {
            firstName: 'Paweł',
            lastName: 'Wichary',
            degree: Degree.MA_ENG,
            username: 'pwichary'
          },
          class: class3
        },
        {
          id: '4',
          status: Status.REJECTED,
          user: {
            firstName: 'Zbigniew',
            lastName: 'Szpunar',
            degree: Degree.DR_ENG,
            username: 'zszpunar'
          },
          class: class4
        }
      ],
      [

      ],
      [

      ],
      [

      ]
    ]);
  }

  public getAllPendingHostingRequests(classes: Classes): Observable<HostingRequest[]> {
    return this.http.get<HostingRequest[]>(
      this.getUrl(
        RestConstants.CLASS + RestConstants.EQUALS + classes.groupKey
        + RestConstants.STATUS + RestConstants.EQUALS + Status.PENDING
      )
    );
  }

  public rejectHostingRequest(hostingRequest: HostingRequest): Observable<boolean> {
    return this.rejectHostingRequests([hostingRequest]);
  }

  public rejectHostingRequests(hostingRequests: HostingRequest[]): Observable<boolean> {
    return this.http.post<boolean>(
      this.getUrl(RestConstants.REJECT),
      {
        objects: hostingRequests
      }
    );
  }

  public acceptHostingRequest(hostingRequest: HostingRequest): Observable<boolean> {
    return of(true);
  }

  private getUrl(url: string): string {
    return CommunicationConstants.getFullDataApiAddress(RestConstants.HOSTING_REQUEST + url);
  }
}
