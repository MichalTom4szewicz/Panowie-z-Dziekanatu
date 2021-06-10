import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClassesStatusEnum } from 'src/app/enums/classes-status-enum';
import { ClassesWithStatus } from 'src/app/helpers/classes-with-status';

@Component({
  selector: 'pzd-classes-details-dialog',
  templateUrl: './classes-details-dialog.component.html',
  styleUrls: ['./classes-details-dialog.component.sass']
})
export class ClassesDetailsDialogComponent implements OnInit {

  public classes: ClassesWithStatus;

  constructor(
    public dialogRef: MatDialogRef<ClassesDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private input: ClassesWithStatus
  ) {}

  ngOnInit(): void {
    this.classes = this.copyClasses(this.input);
  }

  private copyClasses(classes: ClassesWithStatus): ClassesWithStatus {
    return {
      classes: classes.classes,
      status: ClassesStatusEnum.UNSELECTED
    }
  }

}
