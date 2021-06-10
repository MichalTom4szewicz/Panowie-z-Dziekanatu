import { Time } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Classes } from 'src/app/domain/classes';
import { Parity } from 'src/app/enums/parity';
import { CalendarUtils } from 'src/app/utils/calendar-utils';
import { UserUtils } from 'src/app/utils/user-utils';

@Component({
  selector: 'pzd-classes-content',
  templateUrl: './classes-content.component.html',
  styleUrls: ['./classes-content.component.sass']
})
export class ClassesContentComponent implements OnInit {

  @Input() classes: Classes;
  @Input() dualDisplay: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  public formatClassesName(name: string): string {
    
    if (this.dualDisplay) {
      const regex: RegExp = /\b[a-zA-Z]/g;
      return name.match(regex)?.join('')!;
    } else {
      return name;
    }
  }

  public getTime(time: Time): string {
    return CalendarUtils.getTime(time);
  }

  public displayUser(): string {
    if (this.dualDisplay) {
      return this.classes.course.supervisor.lastName;
    } else {
      return UserUtils.displayUser(this.classes.course.supervisor);
    }
  }

  public everySecondWeek(): boolean {
    return this.classes.parity !== Parity.NONE;
  }

  public getParity(): string {
    if (this.classes.parity === Parity.EVEN) {
      return 'P';
    } else {
      return 'NP';
    }
  }
}
