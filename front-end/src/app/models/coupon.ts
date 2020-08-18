import {Employees} from './employees';
import {Customer} from './customer';

export class Coupon {
  couponId: number;
  createDate: Date;
  employee: Employees;
  customer: Customer;
  deleteFlag: boolean;
}
