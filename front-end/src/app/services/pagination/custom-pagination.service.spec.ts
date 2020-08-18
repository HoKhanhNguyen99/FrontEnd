import { TestBed } from '@angular/core/testing';

import { CustomPaginationService } from './custom-pagination.service';

describe('CustomPaginationService', () => {
  let service: CustomPaginationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomPaginationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
