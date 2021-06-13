import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { CommunicationConstants } from 'src/app/constants/communication-constants';
import { RestConstants } from 'src/app/constants/rest-constants';
import { Classes } from 'src/app/domain/classes';
import { HostingRequest } from 'src/app/domain/hosting-request';
import { Status } from 'src/app/enums/status';

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
    return this.http.delete<boolean>(
      this.getUrl(RestConstants.REJECTED)
    );
  }

  public getRegisteredClasses(): Observable<HostingRequest[][]> {
    return this.http.get<HostingRequest[][]>(
      this.getUrl(
        RestConstants.SORTED
      )
    );
  }

  public getAllPendingHostingRequests(classes: Classes): Observable<HostingRequest[]> {
    return this.http.get<HostingRequest[]>(
      this.getUrl(
        RestConstants.CLASS + RestConstants.QUERY
        + RestConstants.GROUP_KEY + classes.groupKey
        + RestConstants.AND + RestConstants.STATUS + Status.PENDING
      )
    );
  }

  public rejectHostingRequest(hostingRequest: HostingRequest): Observable<boolean> {
    return this.rejectHostingRequests([hostingRequest]);
  }

  public rejectHostingRequests(hostingRequests: HostingRequest[]): Observable<boolean> {
    return this.http.put<boolean>(
      this.getUrl(RestConstants.REJECT),
      {
        objects: hostingRequests
      }
    );
  }

  public acceptHostingRequest(hostingRequest: HostingRequest): Observable<boolean> {
    return this.http.put<boolean>(
      this.getUrl(RestConstants.ACCEPT),
      {
        objects: hostingRequest
      }
    );
  }

  private getUrl(url: string): string {
    return CommunicationConstants.getFullDataApiAddress(RestConstants.HOSTING_REQUEST + url);
  }
}
