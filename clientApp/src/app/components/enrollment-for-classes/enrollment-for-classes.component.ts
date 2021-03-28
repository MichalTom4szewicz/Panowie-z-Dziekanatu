import { WeekDay } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pzd-enrollment-for-classes',
  templateUrl: './enrollment-for-classes.component.html',
  styleUrls: ['./enrollment-for-classes.component.sass']
})
export class EnrollmentForClassesComponent implements OnInit {

  weekday: typeof WeekDay = WeekDay;
  
  constructor() { }

  ngOnInit(): void {
  }

}
