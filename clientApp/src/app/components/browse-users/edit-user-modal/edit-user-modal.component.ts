import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {User} from '../../../domain/user';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Degree} from '../../../enums/degree';
import {UserDataService} from '../../../services/user-data/user-data.service';

@Component({
  selector: 'pzd-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.sass']
})
export class EditUserModalComponent implements OnInit {
  private readonly _editUserDataForm: FormGroup;
  private _degrees = Degree;
  private _selected = Degree.ENG;

  constructor(@Inject(MAT_DIALOG_DATA) private user: User, private _formBuilder: FormBuilder, private _userDataService: UserDataService) {
    console.log(user);
    this._editUserDataForm = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      degree: ['']
    });
    if (user) {
      this._editUserDataForm.patchValue(user);
    }
  }

  ngOnInit(): void {
  }

  get degrees(): string[] {
    return Object.values(this._degrees).filter((degree) => degree.toLowerCase() === degree);
  }

  get userDataForm(): FormGroup {
    return this._editUserDataForm;
  }

  get selected(): Degree {
    return this._selected;
  }

  set selected(value: Degree) {
    this._selected = value;
  }

  public reset(): void {
    this._editUserDataForm.patchValue(this.user);
  }

  public onSubmit(): void {
    this._userDataService.updateUserData({...this._editUserDataForm.value, username: this.user.username}).subscribe();
  }
}
