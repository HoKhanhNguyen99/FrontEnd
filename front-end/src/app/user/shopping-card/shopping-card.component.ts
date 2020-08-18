import {Component, OnInit} from '@angular/core';
import {CustomerService} from '../../services/customer.service';
import {OrderService} from '../../services/order.service';
import {Customer} from '../../models/customer';
import {Cart} from '../../models/cart';
import {Router} from '@angular/router';
import {UserKey} from '../../models/userKey';

@Component({
  selector: 'app-shopping-card',
  templateUrl: './shopping-card.component.html',
  styleUrls: ['./shopping-card.component.scss']
})
export class ShoppingCardComponent implements OnInit {
  customer: Customer;
  orderNow: Cart[] = [];
  tempMoney = 0;
  totalProduct = 0;
  constructor(private customerService: CustomerService,
              private orderService: OrderService,
              private router: Router) {

  }

  ngOnInit(): void {
    this.orderService.currentCustomer.subscribe(message => {
        this.customer = message;
        if (this.customer != null) {
          this.orderNow = this.customer.cartList;
          console.log(this.orderNow);
          this.calTempMoney();
        }
      },
      error => {
        console.log(error);
        this.customer = null;
      });
  }

  calTempMoney(): void {
    this.orderNow.forEach(cart => {
      this.tempMoney += cart.id.product.price * cart.quantity;
      this.totalProduct += cart.quantity;
    });
  }

  buyLater(i: number): void {
    this.tempMoney = 0;
    this.totalProduct = 0;
    this.orderNow.splice(i, 1);
    this.calTempMoney();
  }

  increase(i: number): void {
    this.tempMoney = 0;
    this.totalProduct = 0;
    this.orderNow[i].quantity++;
    this.calTempMoney();
  }

  decrease(i: number): void {
    this.tempMoney = 0;
    this.totalProduct = 0;
    this.orderNow[i].quantity--;
    this.calTempMoney();
  }

  toOrder(): void {
    this.router.navigate(['/checkout/shipping']);
  }

  deleteCart(cart: Cart): void {
    this.spinnerOn();
    this.orderService.deleteCart(cart, this.customer).toPromise().then(res => {
      this.spinnerOff();
    });
  }

  spinnerOn(): void {
    document.getElementById('overlay').style.display = 'flex';
  }

  spinnerOff(): void {
    document.getElementById('overlay').style.display = 'none';
  }
}
