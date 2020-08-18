import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleManagementComponent } from './sale-management.component';

describe('SaleManagementComponent', () => {
  let component: SaleManagementComponent;
  let fixture: ComponentFixture<SaleManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
