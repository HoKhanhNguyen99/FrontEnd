import {Component, OnInit} from '@angular/core';
import {BrandService} from '../../services/brand.service';
import {CategoryService} from '../../services/category.service';

@Component({
  selector: 'app-home-store',
  templateUrl: './home-store.component.html',
  styleUrls: ['./home-store.component.scss']
})
export class HomeStoreComponent implements OnInit{

  brandList = [];
  categoryList = [];

  constructor(private categoryService: CategoryService,
              private brandService: BrandService) {
  }

  ngOnInit(): void {
    this.categoryService.getAllCategory().subscribe(next => {
      this.categoryList = next;
    },
      error => console.log(error));
    this.brandService.getAllBrandToOption().subscribe(next => this.brandList = next, error => console.log(error));
  }
}
