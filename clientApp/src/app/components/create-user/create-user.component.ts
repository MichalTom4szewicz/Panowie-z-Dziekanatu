import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../services/auth/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'pzd-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.sass']
})
export class CreateUserComponent implements OnInit {
  private readonly _createUserForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _authenticationService: AuthenticationService,
    private _router: Router
  ) {
    this._createUserForm = this._formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: [this.comparePasswords()]});
  }

  ngOnInit(): void {
  }

  public get createUserForm(): FormGroup {
    return this._createUserForm;
  }

  public get username(): AbstractControl {
    return this._createUserForm.get('username') as AbstractControl;
  }

  public get password(): AbstractControl {
    return this._createUserForm.get('password') as AbstractControl;
  }

  public get confirmPassword(): AbstractControl {
    return this._createUserForm.get('confirmPassword') as AbstractControl;
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

  public onSubmit(): void {
    if (this._createUserForm.valid) {
      const usernameValue = this.username?.value;
      const passwordValue = this.password?.value;
      this._authenticationService.createAccount(usernameValue, passwordValue)
        .subscribe(async (value: boolean) => {
          if (value) {
            await this._router.navigate(['login']);
          }
        });
    }
  }

  public onClear(): void {
    this._createUserForm.reset();
  }
}
