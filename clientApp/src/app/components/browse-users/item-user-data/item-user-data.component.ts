import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../domain/user';
import {Classes} from '../../../domain/classes';
import {Course} from '../../../domain/course';
import {EditUserModalComponent} from '../edit-user-modal/edit-user-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {ChangeRoleModalComponent} from '../change-role-modal/change-role-modal.component';
import {UserDataService} from '../../../services/user-data/user-data.service';
import {map} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Component({
  selector: 'pzd-item-user-data',
  templateUrl: './item-user-data.component.html',
  styleUrls: ['./item-user-data.component.sass']
})
export class ItemUserDataComponent implements OnInit {
  @Input() userData: User;

  private readonly _CLASSES_COLUMNS = ['code', 'groupKey', 'type'];
  private readonly _COURSES_COLUMNS = ['code', 'courseName'];

  constructor(public readonly dialog: MatDialog, private _authService: UserDataService) { }

  ngOnInit(): void {
  }

  get userDescriptor(): string {
    return `${this.userData.degree} ${this.userData.firstName} ${this.userData.lastName}`;
  }

  get userCourses(): Array<Course> {
    return this.userData.courses || [];
  }

  get userClasses(): Array<Classes> {
    return this.userData.classes || [];
  }

  get classesColumns(): Array<string> {
    return this._CLASSES_COLUMNS;
  }

  get coursesColumns(): Array<string> {
    return this._COURSES_COLUMNS;
  }

  public openEditUserModal(): void {
    this.dialog.open(EditUserModalComponent, {
      width: '400px',
      data: this.userData
    });
  }

  public openEditRoleModal(): void {
    this._authService.getUserDescriptor(this.userData.username)
      .pipe(
        map((userData) => {
          if (userData.success) {
            return userData.result.role.name;
          } else {
            throwError('No such user');
          }
        })
      )
      .subscribe((value) => {
        this.dialog.open(ChangeRoleModalComponent, {
          width: '400px',
          data: { role: value, username: this.userData.username }
        });
      });
  }
}
