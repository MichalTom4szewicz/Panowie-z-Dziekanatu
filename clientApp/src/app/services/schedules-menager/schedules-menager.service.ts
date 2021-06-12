import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommunicationConstants } from 'src/app/constants/communication-constants';
import { RestConstants } from 'src/app/constants/rest-constants';
import { Classes } from 'src/app/domain/classes';

@Injectable({
  providedIn: 'root'
})
export class SchedulesMenagerService {

  constructor(private http: HttpClient) { }

  public getSchedulesSaved(): Observable<string[]> {
    return this.http.get<string[]>(
      this.getUrl(RestConstants.NAMES)
    );
  }

  public getSchedule(schedule: string): Observable<Classes[]> {
    return this.http.get<Classes[]>(
      this.getUrl(RestConstants.SCHEDULE + RestConstants.QUERY + RestConstants.NAME + schedule)
    );
  }

  public saveSchedule(schedule: Classes[], name: string): Observable<boolean> {
    return this.http.post<boolean>(
      this.getUrl(RestConstants.SCHEDULE),
      {
        name: name,
        objects: schedule
      }
    );
  }

  private getUrl(url: string): string {
    return CommunicationConstants.getFullDataApiAddress(RestConstants.SCHEDULEPARTS + url);
  }
}
