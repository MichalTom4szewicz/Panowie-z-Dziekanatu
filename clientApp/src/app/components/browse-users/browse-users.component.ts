import { Component, OnInit } from '@angular/core';
import {UserDataService} from '../../services/user-data/user-data.service';
import {User} from '../../domain/user';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'pzd-browse-users',
  templateUrl: './browse-users.component.html',
  styleUrls: ['./browse-users.component.sass']
})
export class BrowseUsersComponent implements OnInit {
  private _usersData: User[] = [];

  constructor(private _userDataService: UserDataService, public readonly dialog: MatDialog) { }

  ngOnInit(): void {
    this._userDataService.getAllUsersData().subscribe((result) => {
      console.log(result);
      this._usersData = result;
    });
  }

  get usersData(): User[] {
    return this._usersData;
  }
}
