import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/auth/authentication.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserDataService} from '../../services/user-data/user-data.service';
import {Router} from '@angular/router';
import {Degree} from '../../enums/degree';

@Component({
  selector: 'pzd-edit-user-data',
  templateUrl: './edit-user-data.component.html',
  styleUrls: ['./edit-user-data.component.sass']
})
export class EditUserDataComponent implements OnInit {
  private readonly _userDataForm: FormGroup;
  private readonly _degrees = Degree;
  private _selected = this._degrees.ENG;

  constructor(
    private _formBuilder: FormBuilder,
    private _userDataService: UserDataService,
    private _authService: AuthenticationService,
    private _router: Router
  ) {
    this._userDataForm = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      degree: [this.selected],
    });
  }

  ngOnInit(): void { }

  get selected(): Degree {
    return this._selected;
  }

  set selected(value: Degree) {
    this._selected = value;
  }

  get userDataForm(): FormGroup {
    return this._userDataForm;
  }

  get degrees(): string[] {
    return Object.values(this._degrees).filter((degree) => degree.toLowerCase() === degree);
  }

  public clearFormFields(): void {
    this.userDataForm.reset();
    this.userDataForm.get('degree')?.setValue(this._degrees.ENG);
  }

  public async logOut(): Promise<boolean> {
    this._authService.logOut();
    return this._router.navigate(['/login']);
  }

  public onSubmit(): any {
    const username = AuthenticationService.getUsername();
    if (username) {
      this._userDataService.saveUserData({
          object: { ...this._userDataForm.value, username }
        })
        .subscribe(() => {
          return this._router.navigate(['']);
        }, () => {
          this.userDataForm.setErrors({ creationError: true });
        });
    }
  }
}
