import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCakeComponent } from './home-cake.component';

describe('HomeCakeComponent', () => {
  let component: HomeCakeComponent;
  let fixture: ComponentFixture<HomeCakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeCakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeCakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
