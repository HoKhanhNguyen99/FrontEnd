import { TestBed } from '@angular/core/testing';

import { AccessTimesService } from './access-times.service';

describe('AccessTimesService', () => {
  let service: AccessTimesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessTimesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
