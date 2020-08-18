import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';

import {Order} from '../../models/order';
import {OrderService} from '../../services/order.service';
import {NotificationService} from '../../services/notification.service';

@Component({
  selector: 'app-user-oders',
  templateUrl: './user-oders.component.html',
  styleUrls: ['./user-oders.component.scss']
})
export class UserOdersComponent implements OnInit {
  orders: Order[];
  currentPage = 0;
  totalPage: number;
  idUser: number;

  constructor(private activatedRoute: ActivatedRoute, private orderService: OrderService) {
    this.orderService.currentIdUser.subscribe(message => {
      this.idUser = message;
      this.orderService.currentPage.subscribe(page => {
        this.currentPage = page;
        this.orderService.findAllOrderByUserIdOnPage(this.idUser, this.currentPage).subscribe((next: any) => {
            this.orders = next.content;
            this.totalPage = next.totalPages;
          },
          error => {
            console.log(error);
            this.orders = null;
          });
      });

    });
  }

  ngOnInit(): void {
  }

  nextPage(): void {
    this.orderService.findAllOrderByUserIdOnPage(this.idUser, this.currentPage + 1).subscribe((next: any) => {
        this.orders = next.content;

        this.currentPage++;
        console.log(this.currentPage);
        this.orderService.chancePage(this.currentPage);
      },
      error => {
        console.log(error);
        this.orders = null;
      });
  }

  previousPage(): void {
    this.orderService.findAllOrderByUserIdOnPage(this.idUser, this.currentPage - 1).subscribe((next: any) => {
        this.orders = next.content;
        this.currentPage--;
        this.orderService.chancePage(this.currentPage);

      },
      error => {
        console.log(error);
        this.orders = null;
      });
  }
}
