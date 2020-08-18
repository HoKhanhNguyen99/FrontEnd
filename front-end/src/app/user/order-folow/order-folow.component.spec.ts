import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderFolowComponent } from './order-folow.component';

describe('OrderFolowComponent', () => {
  let component: OrderFolowComponent;
  let fixture: ComponentFixture<OrderFolowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderFolowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderFolowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
