import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {OrderService} from '../../services/order.service';
import {Order} from '../../models/order';
import {Cart} from '../../models/cart';
import {Customer} from '../../models/customer';
import {TypeOfShipping} from '../../models/type-of-shipping';
import {IdOrderDetail, OrderDetail} from '../../models/order-detail';
import {NotificationService} from '../../services/notification.service';

declare var paypal;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  customer: Customer;
  typeOfShipping: TypeOfShipping = new TypeOfShipping(2, 'Giao tiêu chuẩn', 14000);
  paymentMethod = 'Thanh toán bằng tiền mặt khi nhận hàng';
  tempMoney = 0;
  totalProduct = 0;
  totalMoney = 0;
  totalUSD = 0;
  guestOrder: Order = new Order();
  orderNow: Cart[];
  product = {
    price: 0,
    description: 'Thanh toán hóa đơn mua hàng'
  };

  paidFor = false;
  newOrderId: string;
  newOrderReceiverDate: string;

  constructor(private router: Router,
              private orderService: OrderService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.getData();
    this.renderRadioButton();
// Render paypal//
    this.product.price = this.totalUSD;
    paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: this.product.description,
                amount: {
                  currency_code: 'USD',
                  value: this.product.price
                }
              }
            ]
          });
        },
        onApprove: async (data, actions) => {
          this.spinnerOn();
          const order = await actions.order.capture();
          this.paidFor = true;
          this.paymentMethod = 'Đã thanh toán bằng PayPal';
          this.createOrder();
          this.createOrderDetails();
        },
        onError: err => {
          console.log(err);
        }
      })
      .render('#paypal-container');

  }

  private renderRadioButton(): void {
    // tslint:disable-next-line:only-arrow-functions typedef
    $(document).ready(function() {
      // tslint:disable-next-line:typedef
      $('input:radio[name=Regarding]').change(function() {
        if (this.id === 'paypal') {
          $('#divPaypal').addClass('show');

        } else {
          $('#divPaypal').removeClass('show');
        }
        if (this.id === 'other2') {
          $('#divOther2').addClass('show');
        } else {
          $('#divOther2').removeClass('show');
        }
      });

      $('#divShippingStandard').addClass('show');

      // tslint:disable-next-line:typedef
      $('input:radio[name=shipping-method]').change(function() {
        if (this.id === 'shipping-now') {
          $('#divShippingNow').addClass('show');

        } else {
          $('#divShippingNow').removeClass('show');
        }
        if (this.id === 'shipping-standard') {
          $('#divShippingStandard').addClass('show');
        } else {
          $('#divShippingStandard').removeClass('show');
        }
      });
    });
  }

  private getData(): void {
    this.orderService.currentCustomer.subscribe(result => {
      this.customer = result;
      this.orderService.currentOrder.subscribe(message => {
        this.guestOrder = message;
        if (this.guestOrder === null) {
          this.guestOrder = new Order();
          if (this.customer != null) {
            this.guestOrder.deliveryPhoneNumber = this.customer.phone;
            this.guestOrder.receiver = this.customer.userName;
            this.guestOrder.orderAddress = this.customer.address;
            this.orderNow = this.customer.cartList;
            this.typeOfShipping.cost = 14000;
            this.calMoney();
          }
        } else {
          this.orderNow = this.customer.cartList;
          this.calMoney();
        }
      }, error => {
        console.log(error);

      });
    }, error => {
      console.log(error);
    });
  }

  onChecked(typeShipping: string): void {
    if (typeShipping === 'shipping-now') {
      this.typeOfShipping.cost = 25000;
      this.typeOfShipping.id = 1;
      this.typeOfShipping.name = 'Giao ngay';
    } else {
      this.typeOfShipping.cost = 14000;
      this.typeOfShipping.id = 2;
      this.typeOfShipping.name = 'Giao tiêu chuẩn';
    }
    this.totalMoney = this.tempMoney + this.typeOfShipping.cost;
    this.totalUSD = Number((this.totalMoney / 23000).toFixed(2));
  }

  ordered(): void {
    if (this.paymentMethod === 'Thanh toán bằng tiền mặt khi nhận hàng') {
      this.spinnerOn();
      this.createOrder();
      this.createOrderDetails();
    } else {
      this.notificationService.config.horizontalPosition = 'center';
      this.notificationService.create('Thanh toán không thành công,vui lòng thử lại !');
    }
  }

  private async createOrderDetails(): Promise<void> {
    await this.orderService.createOrder(this.guestOrder).toPromise().then(result => {
      this.newOrderId = result.orderId;
      this.newOrderReceiverDate = result.expectedDeliveryDate;
      this.guestOrder.user.cartList.forEach(cart => {
        const orderDetailPk = new IdOrderDetail(cart.id.product, result);
        const orderDetail = new OrderDetail(orderDetailPk, cart.quantity);
        this.orderService.deleteCart(cart, this.customer).subscribe();
        this.orderService.createOrderDetail(orderDetail).subscribe(res => {
        }, error => {
          console.log(error);
        });
      });
    });
    this.spinnerOff();
    this.router.navigate(['/checkout/payment-success', {
      newOrderId: this.newOrderId,
      newOrderReceiverDate: this.newOrderReceiverDate
    }])
    ;

  }

  private createOrder(): void {
    this.guestOrder.orderDate = new Date();
    this.guestOrder.expectedDeliveryDate = new Date();
    this.typeOfShipping.id === 1 ? this.guestOrder.expectedDeliveryDate.setDate(this.guestOrder.orderDate.getDate() + 1)
      : this.guestOrder.expectedDeliveryDate.setDate(this.guestOrder.orderDate.getDate() + 3);
    this.guestOrder.typeOfPayment = this.paymentMethod;
    this.guestOrder.orderStatus = (this.paymentMethod === 'Thanh toán bằng tiền mặt khi nhận hàng') ? 'Đang xử lý' : 'Đặt hàng thành công';
    this.guestOrder.typeOfShipping = this.typeOfShipping;
    this.guestOrder.orderedSuccess = (this.paymentMethod === 'Thanh toán bằng tiền mặt khi nhận hàng') ? null : new Date();
    this.guestOrder.received = null;
    this.guestOrder.takingOrders = null;
    this.guestOrder.handOverShipping = null;
    this.guestOrder.transporting = null;
    this.guestOrder.successfulDelivery = null;
    this.guestOrder.totalMoney = this.totalMoney;
    this.guestOrder.user = this.customer;
  }

  calMoney(): void {
    this.orderNow.forEach(cart => {
      this.totalProduct += cart.quantity;
      this.tempMoney += cart.id.product.price * cart.quantity;
    });
    this.totalMoney = this.tempMoney + this.typeOfShipping.cost;
    this.totalUSD = Number((this.totalMoney / 23000).toFixed(2));
  }

  spinnerOn(): void {
    document.getElementById('overlay').style.display = 'flex';
  }

  spinnerOff(): void {
    document.getElementById('overlay').style.display = 'none';
  }

}
