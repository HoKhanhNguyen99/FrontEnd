import {Component, OnInit} from '@angular/core';
import {OrderService} from '../../services/order.service';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.scss']
})
export class UserManageComponent implements OnInit {
  idUser: number;

  constructor(private orderService: OrderService) {
    this.orderService.currentIdUser.subscribe(message => this.idUser = message);
  }

  ngOnInit(): void {
  }


}
