import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplaceClassesDialogComponent } from './replace-classes-dialog.component';

describe('ReplaceClassesDialogComponent', () => {
  let component: ReplaceClassesDialogComponent;
  let fixture: ComponentFixture<ReplaceClassesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplaceClassesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplaceClassesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
