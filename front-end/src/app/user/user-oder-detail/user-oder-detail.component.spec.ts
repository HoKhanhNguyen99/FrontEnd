import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOderDetailComponent } from './user-oder-detail.component';

describe('UserOderDetailComponent', () => {
  let component: UserOderDetailComponent;
  let fixture: ComponentFixture<UserOderDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserOderDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
