import { TestBed } from '@angular/core/testing';

import { ScheduleRegisterService } from './schedule-register.service';

describe('ScheduleRegisterService', () => {
  let service: ScheduleRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
