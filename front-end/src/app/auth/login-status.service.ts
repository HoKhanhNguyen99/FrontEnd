import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class LoginStatusService {

  constructor() { }

  // tslint:disable-next-line:ban-types
  private state$ = new BehaviorSubject<Boolean>(false);
  status = this.state$.asObservable();
  // tslint:disable-next-line:typedef
  changeState(myChange) {
    console.log('change to:', myChange);
    this.state$.next(myChange);
  }
}
