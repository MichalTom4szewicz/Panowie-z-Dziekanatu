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
    //TODO: add sorting
    let index: number = CalendarConstants.WEEK_DAYS_ORDER.get(element.weekDay)!;
    let classGridCopy: Classes[][] = this.classGrid.value;
    classGridCopy[index] = [...this.classGrid.value[index], element];
    this.classGrid.next(classGridCopy);
  }

  public removeElement(element: Classes): void {
    let index: number = CalendarConstants.WEEK_DAYS_ORDER.get(element.weekDay)!;
    let classGridCopy: Classes[][] = this.classGrid.value;
    classGridCopy[index] = classGridCopy[index].filter(i => i !== element);
    this.classGrid.next(classGridCopy);
  }
}
