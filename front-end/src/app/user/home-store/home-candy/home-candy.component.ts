import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../../services/product.service';

@Component({
  selector: 'app-home-candy',
  templateUrl: './home-candy.component.html',
  styleUrls: ['./home-candy.component.scss']
})
export class HomeCandyComponent implements OnInit {

  constructor(private productService: ProductService) { }
  candyList = [];
  reverse = false;
  key = 'amount_sold';
  p = 1;
  // tslint:disable-next-line:typedef
  sort(key){
    this.key = key;
    this.reverse = !this.reverse;
  }

  ngOnInit(): void {
    this.productService.getAllProductByCategory(2).subscribe(next => this.candyList = next,
        error => console.log(error));
  }

}
