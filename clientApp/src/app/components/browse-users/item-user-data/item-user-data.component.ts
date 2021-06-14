import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../../domain/user';
import {Classes} from '../../../domain/classes';
import {Course} from '../../../domain/course';
import {EditUserModalComponent} from '../edit-user-modal/edit-user-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {ChangeRoleModalComponent} from '../change-role-modal/change-role-modal.component';
import {UserDataService} from '../../../services/user-data/user-data.service';
import {map} from 'rxjs/operators';
import {throwError} from 'rxjs';

export class UserInfo {
  public details: User;
  public userRole: { name: string };
  public username: string;
}

@Component({
  selector: 'pzd-item-user-data',
  templateUrl: './item-user-data.component.html',
  styleUrls: ['./item-user-data.component.sass']
})
export class ItemUserDataComponent implements OnInit {
  @Input() userData: UserInfo;
  @Output() changed = new EventEmitter<boolean>();

  private readonly _CLASSES_COLUMNS = ['code', 'groupKey', 'type'];
  private readonly _COURSES_COLUMNS = ['code', 'courseName'];

  constructor(public readonly dialog: MatDialog, private _userDataService: UserDataService) { }

  ngOnInit(): void {
  }

  get userDescriptor(): string {
    if (this.userData.details) {
      return `${this.userData.details.degree} ${this.userData.details.firstName} ${this.userData.details.lastName}`;
    } else {
      return ``;
    }
  }

  get userCourses(): Array<Course> {
    return this.userData.details?.courses || [];
  }

  get userClasses(): Array<Classes> {
    return this.userData.details?.classes || [];
  }

  get classesColumns(): Array<string> {
    return this._CLASSES_COLUMNS;
  }

  get coursesColumns(): Array<string> {
    return this._COURSES_COLUMNS;
  }

  public openEditUserModal(): void {
    const dialog = this.dialog.open(EditUserModalComponent, {
      width: '400px',
      data: {...this.userData.details, username: this.userData.username}
    });
    dialog.afterClosed().subscribe(() => {
      this.changed.emit(true);
    });
  }

  public openEditRoleModal(): void {
    this._userDataService.getUserAccount(this.userData.username)
      .pipe(
        map((userData) => {
          if (userData.success) {
            return userData.result.role?.name || undefined;
          } else {
            throwError('No such user');
          }
        })
      )
      .subscribe((value) => {
        const dialog = this.dialog.open(ChangeRoleModalComponent, {
          width: '400px',
          data: { role: value, username: this.userData.username }
        });
        dialog.afterClosed().subscribe(() => {
          this.changed.emit(true);
        });
      });
  }

  public deleteUser(): void {
    if (this.userData.details !== undefined && this.userData.details !== null) {
      this._userDataService.deleteUserData(this.userData.username).subscribe(() => {
        this._userDataService.deleteUserAccount(this.userData.username).subscribe(() => {
          this.changed.emit(true);
        });
      });
    } else {
      this._userDataService.deleteUserAccount(this.userData.username).subscribe(() => {
        this.changed.emit(true);
      });
    }
  }
}
