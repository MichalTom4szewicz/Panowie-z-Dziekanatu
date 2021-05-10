import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedSchedulesComponent } from './saved-schedules.component';

describe('SavedSchedulesComponent', () => {
  let component: SavedSchedulesComponent;
  let fixture: ComponentFixture<SavedSchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedSchedulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
