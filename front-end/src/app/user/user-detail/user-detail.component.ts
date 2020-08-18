import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CustomerService} from '../../services/customer.service';
import {Customer} from '../../models/customer';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {OrderService} from '../../services/order.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  customer: Customer;
  idUser: number;

  constructor(private customerService: CustomerService,
              private activatedRoute: ActivatedRoute, private orderService: OrderService) {
    this.orderService.currentIdUser.subscribe(message => {
      this.idUser = message;
      console.log(this.idUser);
      this.customerService.getCustomerById(this.idUser).subscribe(next => {
          this.customer = next;
                  },
        error => {
          console.log(error);
          this.customer = null;
        });
    });

  }

  ngOnInit(): void {
  }
}
