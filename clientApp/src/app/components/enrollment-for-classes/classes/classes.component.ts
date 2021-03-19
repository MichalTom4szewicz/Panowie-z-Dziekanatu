import { Time } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Classes } from 'src/app/domain/classes';

@Component({
  selector: 'pzd-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.sass']
})
export class ClassesComponent implements OnInit {

  @Input() classes: Classes;

  constructor() { }

  ngOnInit(): void {}

  public getTime(time: Time): string {
    return time.hours.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    }) + ":" + time.minutes.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    });
  }
}
