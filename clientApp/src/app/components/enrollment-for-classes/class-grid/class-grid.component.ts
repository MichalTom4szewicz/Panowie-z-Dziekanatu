import { WeekDay } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Classes } from 'src/app/domain/classes';

@Component({
  selector: 'pzd-class-grid',
  templateUrl: './class-grid.component.html',
  styleUrls: ['./class-grid.component.sass']
})
export class ClassGridComponent implements OnInit {

  weekday: typeof WeekDay = WeekDay;

  constructor() { }

  ngOnInit(): void {}
}
