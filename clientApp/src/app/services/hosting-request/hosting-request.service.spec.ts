import { TestBed } from '@angular/core/testing';

import { HostingRequestService } from './hosting-request.service';

describe('HostingRequestService', () => {
  let service: HostingRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HostingRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
