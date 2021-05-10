import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { Router } from '@angular/router';

@Component({
	selector: 'pzd-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
	private readonly _loginForm: FormGroup;
	private _isPasswordVisible = false;

	constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router: Router) {
		this._loginForm = this.formBuilder.group({
			username: ['', Validators.required],
			password: ['', Validators.required],
		});
	}

	get loginForm(): FormGroup {
		return this._loginForm;
	}

	get username(): AbstractControl {
    return this.loginForm.get('username') as AbstractControl;
  }

  get password(): AbstractControl {
    return this.loginForm.get('password') as AbstractControl;
  }

	get isPasswordVisible(): boolean {
		return this._isPasswordVisible;
	}

	togglePasswordVisibility(): void {
		this._isPasswordVisible = !this._isPasswordVisible;
	}

	clearFormFields(): void {
		this.loginForm.reset();
	}

	shouldShowLoginDataError(): boolean {
    return (this.username.invalid
      && this.password.invalid
      && this.username.touched
      && this.password.touched) || this._loginForm.hasError('incorrectLoginData');
  }

	onSubmit(): void {
		this.authService.logIn(this.username.value, this.password.value)
      .subscribe(async (value) => {
        if (value) {
          this.authService.setToken(value);
          await this.router.navigate(['']);
        } else {
          this.loginForm.setErrors({ incorrectLoginData: true });
        }
      }, () => {
        this.loginForm.setErrors({ incorrectLoginData: true });
      });
	}

	async ngOnInit(): Promise<void> {
	  if (this.authService.isAuthenticated()) {
	    await this.router.navigate(['']);
    }
  }
}
