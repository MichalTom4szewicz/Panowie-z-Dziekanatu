import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Course} from 'src/app/domain/course';
import {UserDataService} from '../../../services/user-data/user-data.service';
import {User} from '../../../domain/user';
import {AuthenticationService} from '../../../services/auth/authentication.service';
import {UserRole} from '../../../enums/user-role.enum';

@Component({
  selector: 'pzd-manage-courses-dialog',
  templateUrl: './manage-courses-dialog.component.html',
  styleUrls: ['./manage-courses-dialog.component.sass']
})
export class ManageCoursesDialogComponent implements OnInit {
  userList: User[] = [];
  courseForm: FormGroup;
  private readonly _adminMode = AuthenticationService.hasRole(UserRole.GOD);
  private _selectedSupervisor: User;

  constructor(
    public dialogRef: MatDialogRef<ManageCoursesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {course: Course, edit: boolean},
    private _userDataService: UserDataService
  ) {
    if (this.isAdminMode) {
      this._selectedSupervisor = data.course.supervisor;
      this._userDataService.getAllUsersData().subscribe((result) => {
        this.userList = result;
      });
    }
  }

  ngOnInit(): void {
    this.courseForm = new FormGroup({
      name: new FormControl(this.data.course.name),
      courseKey: new FormControl({ value: this.data.course.courseKey, disabled: this.data.edit}),
      supervisor: new FormControl(this._selectedSupervisor)
    });
    console.log(this.courseForm.value );
  }

  get selectedSupervisor(): User {
    return this._selectedSupervisor;
  }

  set selectedSupervisor(value: User) {
    this._selectedSupervisor = value;
  }

  get isAdminMode(): boolean {
    return this._adminMode;
  }

  public doNothing(): void {
    this.closeDialog({isSaved: false, course: undefined});
  }

  public save(): void {
    this.closeDialog({isSaved: true, course: this.courseForm.getRawValue()});
  }

  private closeDialog(result: ManageCoursesDialogResult): void {
    this.dialogRef.close(result);
  }

  public validForm(): boolean {
    return !this.courseForm.valid;
  }
}

interface ManageCoursesDialogResult {
  isSaved: boolean,
  course?: Course
}
