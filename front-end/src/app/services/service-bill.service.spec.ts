import { TestBed } from '@angular/core/testing';

import { ServiceBillService } from './service-bill.service';

describe('ServiceBillService', () => {
  let service: ServiceBillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceBillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
