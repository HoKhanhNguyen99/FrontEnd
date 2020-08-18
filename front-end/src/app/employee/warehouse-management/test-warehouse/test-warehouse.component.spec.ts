import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestWarehouseComponent } from './test-warehouse.component';

describe('TestWarehouseComponent', () => {
  let component: TestWarehouseComponent;
  let fixture: ComponentFixture<TestWarehouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestWarehouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
