import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Classes } from 'src/app/domain/classes';

@Component({
  selector: 'pzd-replace-classes-dialog',
  templateUrl: './replace-classes-dialog.component.html',
  styleUrls: ['./replace-classes-dialog.component.sass']
})
export class ReplaceClassesDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ReplaceClassesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public classes: Classes[]
  ) {}

  ngOnInit(): void {
  }

  public doNothing(): void {
    this.dialogRef.close(false);
  }
  
  public replace(): void {
    this.dialogRef.close(true);
  }
}
