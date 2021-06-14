import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CommunicationConstants } from 'src/app/constants/communication-constants';
import { RestConstants } from 'src/app/constants/rest-constants';
import { Course } from 'src/app/domain/course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient) { }

  public getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(
      this.getUrl('')
    );
  }

  public getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(
      this.getUrl('/all')
    );
  }

  public addCourse(course: Course): Observable<boolean> {
    return this.http.post<boolean>(
      this.getUrl(''),
      { object: course }
    );
  }

  public updateCourse(course: Course): Observable<boolean> {
    return this.http.put<boolean>(
      this.getUrl(RestConstants.QUERY + RestConstants.COURSE_KEY + course.courseKey),
      { object: course }
    );
  }

  public deleteCourse(course: Course): Observable<boolean> {
    return this.http.delete<boolean>(
      this.getUrl(RestConstants.QUERY + RestConstants.COURSE_KEY + course.courseKey)
    );
  }

  private getUrl(url: string): string {
    return CommunicationConstants.getFullDataApiAddress(RestConstants.COURSES + url);
  }
}
