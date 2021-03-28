import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentForClassesComponent } from './enrollment-for-classes.component';

describe('EnrollmentForClassesComponent', () => {
  let component: EnrollmentForClassesComponent;
  let fixture: ComponentFixture<EnrollmentForClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrollmentForClassesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentForClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
