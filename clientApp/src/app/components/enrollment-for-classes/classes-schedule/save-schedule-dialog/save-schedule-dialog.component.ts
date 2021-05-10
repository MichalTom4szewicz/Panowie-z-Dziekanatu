import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'pzd-save-schedule-dialog',
  templateUrl: './save-schedule-dialog.component.html',
  styleUrls: ['./save-schedule-dialog.component.sass']
})
export class SaveScheduleDialogComponent implements OnInit {

  newName: string;

  constructor(
    public dialogRef: MatDialogRef<SaveScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public schedules: string[]
  ) { }

  ngOnInit(): void {
  }

  public doNothing(): void {
    this.dialogRef.close('');
  }
  
  public save(name: string): void {
    this.dialogRef.close(name);
  }
}
