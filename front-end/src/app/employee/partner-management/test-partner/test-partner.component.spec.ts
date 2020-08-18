import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPartnerComponent } from './test-partner.component';

describe('TestPartnerComponent', () => {
  let component: TestPartnerComponent;
  let fixture: ComponentFixture<TestPartnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestPartnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
