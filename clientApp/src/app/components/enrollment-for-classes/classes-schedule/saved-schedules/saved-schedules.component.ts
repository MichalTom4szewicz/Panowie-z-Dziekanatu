import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'pzd-saved-schedules',
  templateUrl: './saved-schedules.component.html',
  styleUrls: ['./saved-schedules.component.sass']
})
export class SavedSchedulesComponent implements OnInit {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {schedules: string[]},
    private _bottomSheetRef: MatBottomSheetRef<SavedSchedulesComponent>
    ) { }

  ngOnInit(): void {
  }

  select(event: MouseEvent, schedule: string): void {
    event.preventDefault();
    this._bottomSheetRef.dismiss(schedule);
  }
}
