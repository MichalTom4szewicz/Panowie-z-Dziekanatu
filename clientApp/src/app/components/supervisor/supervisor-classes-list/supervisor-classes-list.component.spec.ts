import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorClassesListComponent } from './supervisor-classes-list.component';

describe('SupervisorClassesListComponent', () => {
  let component: SupervisorClassesListComponent;
  let fixture: ComponentFixture<SupervisorClassesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupervisorClassesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorClassesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
