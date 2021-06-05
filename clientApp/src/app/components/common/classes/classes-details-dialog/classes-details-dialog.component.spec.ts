import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesDetailsDialogComponent } from './classes-details-dialog.component';

describe('ClassesDetailsDialogComponent', () => {
  let component: ClassesDetailsDialogComponent;
  let fixture: ComponentFixture<ClassesDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassesDetailsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassesDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
