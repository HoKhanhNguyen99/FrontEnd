import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessTimesComponent } from './access-times.component';

describe('AccessTimesComponent', () => {
  let component: AccessTimesComponent;
  let fixture: ComponentFixture<AccessTimesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessTimesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessTimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
