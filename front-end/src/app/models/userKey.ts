import {Account} from './account';

export class UserKey {
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

  constructor() {
  }

}
