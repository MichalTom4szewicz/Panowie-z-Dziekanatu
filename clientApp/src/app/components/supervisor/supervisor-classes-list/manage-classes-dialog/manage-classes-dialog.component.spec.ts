import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageClassesDialogComponent } from './manage-classes-dialog.component';

describe('ManageClassesDialogComponent', () => {
  let component: ManageClassesDialogComponent;
  let fixture: ComponentFixture<ManageClassesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageClassesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageClassesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
