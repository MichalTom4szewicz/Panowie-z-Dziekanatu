import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClassesScheduleComponent } from './create-classes-schedule.component';

describe('ClassesScheduleComponent', () => {
  let component: CreateClassesScheduleComponent;
  let fixture: ComponentFixture<CreateClassesScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateClassesScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateClassesScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
