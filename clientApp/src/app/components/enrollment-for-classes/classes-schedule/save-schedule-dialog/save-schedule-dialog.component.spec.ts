import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveScheduleDialogComponent } from './save-schedule-dialog.component';

describe('SaveScheduleDialogComponent', () => {
  let component: SaveScheduleDialogComponent;
  let fixture: ComponentFixture<SaveScheduleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveScheduleDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveScheduleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
