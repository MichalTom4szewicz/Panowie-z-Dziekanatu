import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRoleModalComponent } from './change-role-modal.component';

describe('ChangeRoleModalComponent', () => {
  let component: ChangeRoleModalComponent;
  let fixture: ComponentFixture<ChangeRoleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeRoleModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRoleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
