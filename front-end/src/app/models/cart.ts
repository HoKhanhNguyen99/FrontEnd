import {Product} from './product';
import {UserKey} from './userKey';

export class Cart {
  id: CartId;
  quantity: number;

}
export class CartId {
  product: Product;
  user: UserKey;
}
