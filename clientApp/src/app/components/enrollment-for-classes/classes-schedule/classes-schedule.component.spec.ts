import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesScheduleComponent } from './classes-schedule.component';

describe('ClassesScheduleComponent', () => {
  let component: ClassesScheduleComponent;
  let fixture: ComponentFixture<ClassesScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassesScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassesScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
