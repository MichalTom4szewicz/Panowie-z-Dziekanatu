import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Course } from 'src/app/domain/course';
import { Degree } from 'src/app/enums/degree';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor() { }
  
  public getCourses(): Observable<Course[]> {
    return of([
      {
        name: 'Zastosowania inform. w gospod.',
        courseKey: 'INZ000011',
        supervisor: {
          firstName: 'Tomasz',
          lastName: 'Szandała',
          degree: Degree.DR_ENG,
          username: 'tszandala'
        }
      },
      {
        name: 'Projektowanie baz danych',
        courseKey: 'INZ546210',
        supervisor: {
          firstName: 'Tomasz',
          lastName: 'Szandała',
          degree: Degree.DR_ENG,
          username: 'tszandala'
        }
      },
      {
        name: 'Projektowanie oprogramowania',
        courseKey: 'INZ002341',
        supervisor: {
          firstName: 'Tomasz',
          lastName: 'Szandała',
          degree: Degree.DR_ENG,
          username: 'tszandala'
        }
      }
    ]);
  }

  public addCourse(course: Course): Observable<boolean> {
    return of(true);
  }

  public updateCourse(course: Course): Observable<boolean> {
    return of(true);
  }

  public deleteCourse(course: Course): Observable<boolean> {
    return of(true);
  }
}
