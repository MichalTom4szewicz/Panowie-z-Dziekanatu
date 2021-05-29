import { Component, OnInit } from '@angular/core';
import {UserRole} from './enums/user-role.enum';

@Component({
  selector: 'pzd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'clientApp';
  userRole = UserRole;

  constructor() {}

  ngOnInit(): void {}
}
