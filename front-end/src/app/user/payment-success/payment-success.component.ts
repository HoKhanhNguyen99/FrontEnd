import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit {
  newOrderId: string;
  newOrderReceiverDate: string;
  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
     this.newOrderId = this.activatedRoute.snapshot.paramMap.get('newOrderId');
     this.newOrderReceiverDate = this.activatedRoute.snapshot.paramMap.get('newOrderReceiverDate');
     console.log(this.newOrderReceiverDate);

  }

}
