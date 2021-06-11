import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Course } from 'src/app/domain/course';

@Component({
  selector: 'pzd-manage-courses-dialog',
  templateUrl: './manage-courses-dialog.component.html',
  styleUrls: ['./manage-courses-dialog.component.sass']
})
export class ManageCoursesDialogComponent implements OnInit {

  courseForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ManageCoursesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {course: Course, edit: boolean}
    ) { }

  ngOnInit(): void {
    this.courseForm = new FormGroup({
      name: new FormControl(this.data.course.name),
      courseKey: new FormControl({ value: this.data.course.courseKey, disabled: this.data.edit}),
      supervisor: new FormGroup({
        firstName: new FormControl(this.data.course.supervisor.firstName),
        lastName: new FormControl(this.data.course.supervisor.lastName),
        degree: new FormControl(this.data.course.supervisor.degree),
        username: new FormControl(this.data.course.supervisor.username),
      })
    });
  }

  public doNothing(): void {
    this.closeDialog({isSaved: false, course: undefined});
  }

  public save(): void {
    this.closeDialog({isSaved: true, course: this.courseForm.getRawValue()}); 
  }

  private closeDialog(result: ManageCoursesDialogResult): void {
    this.dialogRef.close(result);
  }

  public validForm(): boolean {
    return !this.courseForm.valid;
  }
}

interface ManageCoursesDialogResult {
  isSaved: boolean,
  course?: Course
}
