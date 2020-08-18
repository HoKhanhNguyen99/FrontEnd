import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBakeryComponent } from './home-bakery.component';

describe('HomeBakeryComponent', () => {
  let component: HomeBakeryComponent;
  let fixture: ComponentFixture<HomeBakeryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeBakeryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeBakeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
