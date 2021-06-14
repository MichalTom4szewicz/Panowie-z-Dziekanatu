import { Component, OnInit } from '@angular/core';
import {UserDataService} from '../../services/user-data/user-data.service';
import {User} from '../../domain/user';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {map} from 'rxjs/operators';
import {UserInfo} from './item-user-data/item-user-data.component';
import {AddNewUserComponent} from './add-new-user/add-new-user.component';

@Component({
  selector: 'pzd-browse-users',
  templateUrl: './browse-users.component.html',
  styleUrls: ['./browse-users.component.sass']
})
export class BrowseUsersComponent implements OnInit {
  private _usersData: User[] = [];
  private _userAccounts: any[] = [];
  private _userInfo: UserInfo[] = [];

  constructor(private _userDataService: UserDataService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this._userDataService.getAllUserAccounts()
      .pipe(map((response) => response.success ? response.result : []))
      .subscribe((result) => {
        this._userAccounts = result;
        this._userDataService.getAllUsersData().subscribe((usersInfo) => {
          this._usersData = usersInfo;
          this._userInfo = this._userAccounts.map((userAccount) => {
            return {
              ...userAccount,
              details: this._usersData.find((userData) => userAccount.username === userData.username)
            };
          });
        });
      });
  }

  get usersInfo(): any[] {
    return this._userInfo;
  }

  public openAddUserModal(): void {
    const dialogRef = this.dialog.open(AddNewUserComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(() => {
      this.loadData();
    });
    // this.dialog.afterAllClosed.subscribe(() => {
    // });
  }
}
