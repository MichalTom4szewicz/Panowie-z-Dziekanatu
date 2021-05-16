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
  weekDays: [WeekDay, string][] = [
    [WeekDay.Monday, 'Poniedziałek'],
    [WeekDay.Tuesday, 'Wtorek'],
    [WeekDay.Wednesday, 'Środa'],
    [WeekDay.Thursday, 'Czwartek'],
    [WeekDay.Friday, 'Piątek'],
    [WeekDay.Saturday, 'Sobota'],
    [WeekDay.Sunday, 'Niedziela']
  ];
  classesTyp: [Typ, string][] = [
    [Typ.NONE, ''],
    [Typ.EXERCISE, 'Ćwiczenia'],
    [Typ.LABORATORIES, 'Laboratoria'],
    [Typ.PROJECT, 'Projekt'],
    [Typ.SEMINAR, 'Seminarium'],
    [Typ.LECTURE, 'Wykład']
  ];
  classesParity: [Parity, string][] = [
    [Parity.NONE, 'Co tydzień'],
    [Parity.EVEN, 'Parzyste'],
    [Parity.ODD, 'Nieparzyste']
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
    this.dialogRef.close([false, undefined]);
  }

  public save(): void {
    this.dialogRef.close([true, this.classesForm.value]);
  }

  public validForm(): boolean {
    return !this.classesForm.valid;
  }
}
