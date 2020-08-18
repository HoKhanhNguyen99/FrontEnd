import {Role} from './role';

export class Account {
  accountId: number;
  accountName: string;
  accountPassword: string | Int32Array;
  deleteFlag: boolean;
  role: Role;
  reason: string;
}
