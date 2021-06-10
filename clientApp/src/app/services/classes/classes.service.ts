import { WeekDay } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommunicationConstants } from 'src/app/constants/communication-constants';
import { RestConstants } from 'src/app/constants/rest-constants';
import { Classes } from 'src/app/domain/classes';
import { Pair } from 'src/app/helpers/pair';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {

  constructor(private http: HttpClient) { }

  public getClassesByCourse(courseKey: string): Observable<Classes[]> {
    return this.http.get<Classes[]>(
      this.getUrl(RestConstants.COURSE + RestConstants.EQUALS + courseKey)
    );
  }

  public getClassesByWeekDay(weekDay: WeekDay): Observable<Classes[][]> {
    return this.http.get<Classes[][]>(
      this.getUrl(RestConstants.WEEK_DAY + RestConstants.EQUALS + weekDay)
    );
  }

  public getClassesConflicts(weekDay: WeekDay): Observable<Pair<string, [number, number][]>[]> {
    return this.http.get<Pair<string, [number, number][]>[]>(
      this.getUrl(RestConstants.CONFLICTS + '=' + weekDay)
    );
  }

  public getClassesMap(weekDay: WeekDay): Observable<Pair<string, [number, number]>[]> {
    return this.http.get<Pair<string, [number, number]>[]>(
      this.getUrl(RestConstants.MAP + RestConstants.EQUALS + weekDay)
    );
  }

  public addClasses(classes: Classes): Observable<boolean> {
    return this.http.post<boolean>(
      this.getUrl(''),
      { object: classes }
    );
  }

  public updateClasses(classes: Classes): Observable<boolean> {
    return this.http.put<boolean>(
      this.getUrl(RestConstants.EQUALS + classes.groupKey),
      { object: classes }
    );
  }

  public deleteClasses(classes: Classes): Observable<boolean> {
    return this.http.delete<boolean>(
      this.getUrl(RestConstants.EQUALS + classes.groupKey)
    );
  }

  private getUrl(url: string): string {
    return CommunicationConstants.getFullDataApiAddress(RestConstants.CLASSES + url);
  }
}
