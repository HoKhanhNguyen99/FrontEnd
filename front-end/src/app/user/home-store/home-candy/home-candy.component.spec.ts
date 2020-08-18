import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCandyComponent } from './home-candy.component';

describe('HomeCandyComponent', () => {
  let component: HomeCandyComponent;
  let fixture: ComponentFixture<HomeCandyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeCandyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeCandyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
