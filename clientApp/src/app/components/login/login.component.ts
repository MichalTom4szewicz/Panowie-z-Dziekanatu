import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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

	get loginForm() {
		return this._loginForm;
	}

	get username() {
    return this.loginForm.get('username')?.value;
  }

  get password() {
    return this.loginForm.get('password')?.value;
  }

	get isPasswordVisible(): boolean {
		return this._isPasswordVisible;
	}

	togglePasswordVisibility() {
		this._isPasswordVisible = !this._isPasswordVisible;
	}

	clearFormFields() {
		this.loginForm.reset();
	}

	onSubmit() {
		console.log(this.loginForm.value);
		this.authService.logIn(this.username, this.password)
      .subscribe(async (value) => {
        if (value) {
          this.authService.setToken(value);
          await this.router.navigate(['']);
        }
		  });
	}

	async ngOnInit(): Promise<void> {
	  if (this.authService.isAuthenticated()) {
	    await this.router.navigate(['']);
    }
  }
}
