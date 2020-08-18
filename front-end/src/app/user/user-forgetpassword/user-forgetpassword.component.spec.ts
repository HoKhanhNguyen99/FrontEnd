import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserForgetpasswordComponent } from './user-forgetpassword.component';

describe('UserForgetpasswordComponent', () => {
  let component: UserForgetpasswordComponent;
  let fixture: ComponentFixture<UserForgetpasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserForgetpasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserForgetpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
