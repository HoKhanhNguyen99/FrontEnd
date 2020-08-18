import {Component, OnInit} from '@angular/core';
import {OrderService} from '../../services/order.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Order} from '../../models/order';

@Component({
  selector: 'app-order-folow',
  templateUrl: './order-folow.component.html',
  styleUrls: ['./order-folow.component.scss']
})
export class OrderFolowComponent implements OnInit {
  order: Order;
  orders: Order[];
  idUser: number;
  isCurrentOrder = false;
  status: number;

  constructor(private orderService: OrderService,
              private activatedRoute: ActivatedRoute) {
    this.orderService.currentIdUser.subscribe(message => {
      this.idUser = message;
      this.orderService.findAllOrderByUserId(this.idUser).subscribe((next: any) => {
          this.orders = next.content;
          console.log(this.orders);
          this.activatedRoute.paramMap.subscribe((param: ParamMap) => {
            const idOrder = Number(param.get('idOrder'));
            this.orders.forEach(order => {
              if (order.orderId === idOrder) {
                this.isCurrentOrder = true;
                return;
              }
            });
            if (this.isCurrentOrder) {
              this.orderService.findOrderById(idOrder).subscribe(next => {
                  this.order = next;
                  this.status = this.checkOrderStatus(this.order.orderStatus);
                  $('section div').removeClass('current');
                  $('.step#' + this.status).toggleClass('current');
                  $('.step#' + this.status).prevAll('div').toggleClass('current');
                  console.log(this.status);

                },
                error => {
                  this.order = null;
                });
            }
          });
        },
        error => {
          console.log(error);
          this.orders = null;
        });
    });
  }

  ngOnInit(): void {


  }

  checkOrderStatus(status): number {
    switch (status) {
      case 'Đặt hàng thành công': {
        return 1;
      }
      case 'Đã tiếp nhận': {
        return 2;
      }
      case 'Đang lấy hàng': {
        return 3;
      }
      case 'Bàn giao vận chuyển': {
        return 4;
      }
      case 'Đang vận chuyển': {
        return 5;
      }
      case 'Giao hàng thành công': {
        return 6;
      }
      default: {
        return 0;
      }
    }
  }
}
