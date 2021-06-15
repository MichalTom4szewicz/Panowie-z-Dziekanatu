import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserRole} from '../../../enums/user-role.enum';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {UserDataService} from '../../../services/user-data/user-data.service';

@Component({
  selector: 'pzd-change-role-modal',
  templateUrl: './change-role-modal.component.html',
  styleUrls: ['./change-role-modal.component.sass']
})
export class ChangeRoleModalComponent implements OnInit {
  private readonly _changeUserRoleForm: FormGroup;
  private _username: string;
  private _selected: any;
  private _roles = [
    { role: UserRole.USER, displayName: 'Prowadzący' },
    { role: UserRole.GOD, displayName: 'Dziekanat' }
  ];
  private _message = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) private userData: any,
    private _formBuilder: FormBuilder,
    private _userDataService: UserDataService
  ) {
    this.selected = this.userRoles.find((userRole) => userRole.role === userData.role);
    this._username = userData.username;
    this._changeUserRoleForm = this._formBuilder.group({
      userRole: [this._selected, Validators.required]
    });
  }

  ngOnInit(): void {
  }

  get userRoles(): any[] {
    return Object.values(this._roles);
  }

  get userRoleForm(): FormGroup {
    return this._changeUserRoleForm;
  }

  get userRole(): FormControl {
    return this.userRoleForm.get('userRole') as FormControl;
  }

  get selected(): any {
    return this._selected;
  }

  set selected(value: any) {
    this._selected = value;
  }

  get message(): string {
    return this._message;
  }

  public onSubmit(): void {
    this._message = '';
    this._userDataService.updateUserRole(this._username, this._selected.role)
      .subscribe((value) => {
        if (value.success) {
          this._message = 'Rola użytkownika zmieniona!';
        } else {
          this._changeUserRoleForm.setErrors({ updateError: true });
        }
      });
  }

  public reset(): void {
    this.selected = this.userRoles.find((userRole) => userRole.role === this.userData.role);
  }
}
