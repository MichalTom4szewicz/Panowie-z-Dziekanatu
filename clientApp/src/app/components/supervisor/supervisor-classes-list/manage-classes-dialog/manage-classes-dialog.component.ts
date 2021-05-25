import { WeekDay } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Classes } from 'src/app/domain/classes';
import { Parity } from 'src/app/enums/parity';
import { Typ } from 'src/app/enums/typ';

@Component({
  selector: 'pzd-manage-classes-dialog',
  templateUrl: './manage-classes-dialog.component.html',
  styleUrls: ['./manage-classes-dialog.component.sass']
})
export class ManageClassesDialogComponent implements OnInit {

  classesForm: FormGroup;
  weekDays: Pair[] = [
    {key: WeekDay.Monday, value: 'Poniedziałek'},
    {key: WeekDay.Tuesday, value: 'Wtorek'},
    {key: WeekDay.Wednesday, value: 'Środa'},
    {key: WeekDay.Thursday, value: 'Czwartek'},
    {key: WeekDay.Friday, value: 'Piątek'},
    {key: WeekDay.Saturday, value: 'Sobota'},
    {key: WeekDay.Sunday, value: 'Niedziela'}
  ];
  classesTyp: Pair[] = [
    {key: Typ.NONE, value: ''},
    {key: Typ.EXERCISE, value: 'Ćwiczenia'},
    {key: Typ.LABORATORIES, value: 'Laboratoria'},
    {key: Typ.PROJECT, value: 'Projekt'},
    {key: Typ.SEMINAR, value: 'Seminarium'},
    {key: Typ.LECTURE, value: 'Wykład'}
  ];
  classesParity: Pair[] = [
    {key: Parity.NONE, value: 'Co tydzień'},
    {key: Parity.EVEN, value: 'Parzyste'},
    {key: Parity.ODD, value: 'Nieparzyste'}
  ];

  constructor(
    public dialogRef: MatDialogRef<ManageClassesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {classes: Classes, edit: boolean}
    ) { }

  ngOnInit(): void {
    this.classesForm = new FormGroup({
      weekDay: new FormControl(this.data.classes.weekDay, [Validators.required]),
      startTime: new FormGroup({
        hours: new FormControl(this.data.classes.startTime.hours, [Validators.required, Validators.min(7), Validators.max(20)]),
        minutes: new FormControl(this.data.classes.startTime.minutes, [Validators.required, Validators.min(0), Validators.max(59)])
      }),
      endTime: new FormGroup({
        hours: new FormControl(this.data.classes.endTime.hours, [Validators.required, Validators.min(7), Validators.max(20)]),
        minutes: new FormControl(this.data.classes.endTime.minutes, [Validators.required, Validators.min(0), Validators.max(59)])
      }),
      host: new FormControl(this.data.classes.host),
      course: new FormControl(this.data.classes.course),
      building: new FormControl(this.data.classes.building, [Validators.required, Validators.pattern("[A-Z]-([0-9])+")]),
      room: new FormControl(this.data.classes.room, [Validators.required]),
      groupKey: new FormControl({ value: this.data.classes.groupKey, disabled: this.data.edit }, [Validators.required, Validators.pattern("[A-Z][0-9][0-9]-[0-9][0-9][a-z]")]),
      typ: new FormControl(this.data.classes.typ, [Validators.required]),
      parity: new FormControl(this.data.classes.parity, [Validators.required])
    });
  }

  public isStartTimeValid(): boolean {
    let startTime: AbstractControl = this.classesForm.get('startTime')!;
    return startTime.touched ? startTime.valid : true;
  }

  public isEndTimeValid(): boolean {
    let endTime: AbstractControl = this.classesForm.get('endTime')!;
    return endTime.touched ? endTime.valid : true;
  }

  public doNothing(): void {
    this.closeDialog({isSaved: false, classes: undefined});
  }

  public save(): void {
    this.closeDialog({isSaved: true, classes: this.classesForm.value});
  }

  private closeDialog(result: ManageClassesDialogResult): void {
    this.dialogRef.close(result);
  }

  public validForm(): boolean {
    return !this.classesForm.valid;
  }
}

interface ManageClassesDialogResult {
  isSaved: boolean,
  classes?: Classes
}

interface Pair {
  key: any,
  value: string
}
