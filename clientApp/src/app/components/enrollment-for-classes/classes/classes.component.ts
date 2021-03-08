import { Component, Input, OnInit } from '@angular/core';
import { Classes } from 'src/app/domain/classes';

@Component({
  selector: 'pzd-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.sass']
})
export class ClassesComponent implements OnInit {

  @Input() class: Classes;

  constructor() { }

  ngOnInit(): void {}

}
