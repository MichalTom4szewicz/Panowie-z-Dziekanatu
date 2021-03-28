import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassGridDayComponent } from './class-grid-day.component';

describe('ClassGridDayComponent', () => {
  let component: ClassGridDayComponent;
  let fixture: ComponentFixture<ClassGridDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassGridDayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassGridDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
