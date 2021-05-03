import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CalendarConstants } from 'src/app/components/constants/calendar-constants';
import { Classes } from 'src/app/domain/classes';

@Injectable({
  providedIn: 'root'
})
export class ClassGridService {

  private classGrid: BehaviorSubject<Classes[][]> = new BehaviorSubject<Classes[][]>([[],[],[],[],[],[],[]]);
  classGridChange: Observable<Classes[][]> = this.classGrid.asObservable();

  constructor() { }

  public addElement(element: Classes): void {
    let index: number = CalendarConstants.WEEK_DAYS_ORDER.get(element.weekDay)!;
    let classGridCopy: Classes[][] = this.classGrid.value;
    classGridCopy[index] = [...this.classGrid.value[index], element].sort(this.compareClasses);
    this.classGrid.next(classGridCopy);
  }

  private compareClasses(c1: Classes, c2: Classes): number {
    const sTime1 = c1.startTime.hours * CalendarConstants.MINUTES_IN_HOUR + c1.startTime.minutes;
    const sTime2 = c2.startTime.hours * CalendarConstants.MINUTES_IN_HOUR + c2.startTime.minutes;

    return sTime1 - sTime2
  }

  public removeElement(element: Classes): void {
    let index: number = CalendarConstants.WEEK_DAYS_ORDER.get(element.weekDay)!;
    let classGridCopy: Classes[][] = this.classGrid.value;
    classGridCopy[index] = classGridCopy[index].filter(i => i !== element);
    this.classGrid.next(classGridCopy);
  }
}
