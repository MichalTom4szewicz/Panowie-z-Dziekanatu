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

  public onSubmit(): void {
    this._userDataService.updateUserRole(this._username, this._selected.role)
      .subscribe((value) => {
        console.log(value);
      });
  }

  public reset(): void {
    this._selected = this.userData.role;
  }
}
