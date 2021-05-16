import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostingRequestsDialogComponent } from './hosting-requests-dialog.component';

describe('HostingRequestsDialogComponent', () => {
  let component: HostingRequestsDialogComponent;
  let fixture: ComponentFixture<HostingRequestsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostingRequestsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostingRequestsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
