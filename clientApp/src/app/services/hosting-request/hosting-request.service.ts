import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { Classes } from 'src/app/domain/classes';
import { HostingRequest } from 'src/app/domain/hosting-request';
import { Degree } from 'src/app/enums/degree';
import { Status } from 'src/app/enums/status';
import { ClassesUtils } from 'src/app/utils/classes-utils';

@Injectable({
  providedIn: 'root'
})
export class HostingRequestService {

  constructor() { }

  public getAllPendingHostingRequests(classes: Classes): Observable<HostingRequest[]> {
    return of([
      {
        id: '1',
        status: Status.PENDING,
        user: {
          firstName: 'Tomasz',
          lastName: 'Szandała',
          degree: Degree.DR_ENG,
          username: 'tszandala'
        },
        class: ClassesUtils.getEmptyClasses()
      },
      {
        id: '2',
        status: Status.PENDING,
        user: {
          firstName: 'Janusz',
          lastName: 'Ratajczak',
          degree: Degree.DR_HAB_ENG,
          username: 'jratajczak'
        },
        class: ClassesUtils.getEmptyClasses()
      },
      {
        id: '3',
        status: Status.PENDING,
        user: {
          firstName: 'Paweł',
          lastName: 'Wichary',
          degree: Degree.MA_ENG,
          username: 'pwichary'
        },
        class: ClassesUtils.getEmptyClasses()
      },
      {
        id: '4',
        status: Status.PENDING,
        user: {
          firstName: 'Zbigniew',
          lastName: 'Szpunar',
          degree: Degree.DR_ENG,
          username: 'zszpunar'
        },
        class: ClassesUtils.getEmptyClasses()
      }
    ]);
  }

  public rejectHostingRequest(hostingRequest: HostingRequest): Observable<boolean> {
    return this.rejectHostingRequests([hostingRequest]);
  }

  public rejectHostingRequests(hostingRequests: HostingRequest[]): Observable<boolean> {
    return of(true);
  }

  public acceptHostingRequest(hostingRequest: HostingRequest): Observable<boolean> {
    return of(true);
  }
}
