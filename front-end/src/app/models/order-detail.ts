import {Product} from './product';
import {Order} from './order';
import {Customer} from './customer';

export class OrderDetail {
  id: IdOrderDetail;
  orderQuantity: number;
  temMoney: number;


  constructor(id: IdOrderDetail, orderQuantity: number) {
    this.id = id;
    this.orderQuantity = orderQuantity;
  }
}

export class IdOrderDetail {
  product: Product;
  orderUser: Order;

  constructor(product: Product, orderUser: Order) {
    this.product = product;
    this.orderUser = orderUser;
  }
}
