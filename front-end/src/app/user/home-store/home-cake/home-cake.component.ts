import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../../services/product.service';

@Component({
  selector: 'app-home-cake',
  templateUrl: './home-cake.component.html',
  styleUrls: ['./home-cake.component.scss']
})
export class HomeCakeComponent implements OnInit {
  cakeList = [];
  reverse = false;
  key = 'amount_sold';
  p = 1;
  // tslint:disable-next-line:typedef
  sort(key){
    this.key = key;
    this.reverse = !this.reverse;
  }

  constructor(public productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getAllProductByCategory(1).subscribe(next => this.cakeList = next,
        error => console.log(error));
  }
}
