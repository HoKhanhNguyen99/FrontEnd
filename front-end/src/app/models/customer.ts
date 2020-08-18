import {Account} from './account';
import {Cart} from './cart';

export class Customer {
  id: number;
  userName: string;
  birthday: Date;
  address: string;
  email: string;
  phone: string;
  gender: string;
  imageUrl: string;
  deleteFlag: boolean;
  account: Account;
  cartList: Cart[];
  listOrder: any[];
  total: any;
  constructor() {
  }

}

