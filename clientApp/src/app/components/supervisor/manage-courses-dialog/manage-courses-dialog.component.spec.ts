import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCoursesDialogComponent } from './manage-courses-dialog.component';

describe('ManageCoursesDialogComponent', () => {
  let component: ManageCoursesDialogComponent;
  let fixture: ComponentFixture<ManageCoursesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCoursesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCoursesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
