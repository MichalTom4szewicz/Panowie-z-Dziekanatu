import { TestBed } from '@angular/core/testing';

import { SchedulesMenagerService } from './schedules-menager.service';

describe('SchedulesMenagerService', () => {
  let service: SchedulesMenagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchedulesMenagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
