import {TypeOfShipping} from './type-of-shipping';
import {Customer} from './customer';
import {OrderDetail} from './order-detail';

export class Order {
  orderId: number;
  orderDate: Date;
  orderStatus: string;
  totalMoney: number;
  orderAddress: string;
  typeOfShipping: TypeOfShipping;
  receiver: string;
  deliveryPhoneNumber: string;
  expectedDeliveryDate: Date;
  typeOfPayment: string;
  orderedSuccess: Date;
  received: Date;
  takingOrders: Date;
  handOverShipping: Date;
  transporting: Date;
  successfulDelivery: Date;
  user: Customer;
  orderDetailList: OrderDetail[];


  constructor() {
  }
}
