import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserRole} from '../../../enums/user-role.enum';
import {MatDialogRef} from '@angular/material/dialog';
import {AuthenticationService} from '../../../services/auth/authentication.service';

@Component({
  selector: 'pzd-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.sass']
})
export class AddNewUserComponent implements OnInit {
  private readonly _addUserForm: FormGroup;
  private _selectedRole = { role: undefined, displayName: ''};
  private _roles = [
    { role: undefined, displayName: ''},
    { role: UserRole.USER, displayName: 'Prowadzący' },
    { role: UserRole.GOD, displayName: 'Dziekanat' }
  ];
  private _message = '';

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthenticationService,
    private _dialogRef: MatDialogRef<AddNewUserComponent>
  ) {
    this._addUserForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      role: [this.selectedValue]
    }, { validators: [this.comparePasswords(), this.roleValid()]});
  }

  get addUserForm(): FormGroup {
    return this._addUserForm;
  }

  get role(): FormControl {
    return this._addUserForm.get('role') as FormControl;
  }

  get username(): FormControl {
    return this._addUserForm.get('username') as FormControl;
  }

  get password(): FormControl {
    return this._addUserForm.get('password') as FormControl;
  }

  get confirmPassword(): FormControl {
    return this._addUserForm.get('confirmPassword') as FormControl;
  }

  get userRoles(): any[] {
    return this._roles;
  }

  get selectedValue(): any {
    return this._selectedRole;
  }

  set selectedValue(newValue: any) {
    console.log(newValue);
    this._selectedRole = newValue;
  }

  get message(): string {
    return this._message;
  }

  public onSubmit(): void {
    this._message = '';
    if (this.addUserForm.valid) {
      this._authService.createAccount(this.username.value, this.password.value, this.role.value.role)
        .subscribe((val) => {
          if (val) {
            this._dialogRef.close();
          } else {
            this._message = 'Wystąpił błąd podczas tworzenia użytkownika';
          }
        });
    }
  }

  public reset(): void {
    this._addUserForm.reset();
  }

  public roleValid(): any {
    return (formGroup: FormGroup) => {
      return formGroup.get('role')?.value.role === undefined
        ? { roleInvalid: true }
        : null;
    };
  }

  public comparePasswords(): (_: FormGroup) => {[Key: string]: any} | null {
    return (formGroup: FormGroup): {[Key: string]: any} | null => {
      const passwordControl = formGroup.get('password');
      const confirmationControl = formGroup.get('confirmPassword');
      if (passwordControl && confirmationControl) {
        return passwordControl.value !== confirmationControl.value ? {
          notIdentical: true
        } : null;
      }
      return null;
    };
  }

  ngOnInit(): void {
  }
}
