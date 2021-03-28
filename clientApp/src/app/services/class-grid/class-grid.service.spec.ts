import { TestBed } from '@angular/core/testing';

import { ClassGridService } from './class-grid.service';

describe('ClassGridService', () => {
  let service: ClassGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
