import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Product} from '../../../models/product';
import {ProductService} from '../../../services/product.service';
import {Page} from '../../../models/pagination/page';
import {CustomPaginationService} from '../../../services/pagination/custom-pagination.service';
import {Unit} from '../../../models/unit';
import {Brand} from '../../../models/brand';
import {Category} from '../../../models/category';
import {NotificationService} from '../../../services/notification.service';
import * as $ from 'jquery';
import {BsDatepickerConfig} from 'ngx-bootstrap/datepicker';


declare const myjs: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class ProductComponent implements OnInit {
  @ViewChild('closeEditModal') closeEditModal;
  @ViewChild('closeCreateModal') closeCreateModal;
  @ViewChild('closeDeleteModal') closeDeleteModal;
  @ViewChild('filterForm') filterForm;
  page: Page<Product> = new Page();
  productForm: FormGroup;
  createProductForm: FormGroup;
  product: Product;
  unitList: Unit[];
  categoryList: Category[];
  brandList: Brand[];
  public productName;
  key: string;
  reverse = false;
  searchProductName: string;
  listBrand: any;
  brandArray = [];
  formArray: FormArray = new FormArray([]);
  minDate: Date;
  maxDate: Date;
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  @ViewChild('searchForm') searchForm;

  constructor(private fb: FormBuilder,
              private productService: ProductService,
              private paginationService: CustomPaginationService,
              private notificationService: NotificationService) {
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate() - 1);
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.dpConfig.containerClass = 'theme-orange';
    this.dpConfig.dateInputFormat = 'DD/MM/YYYY';
  }

  ngOnInit(): void {
    this.buildFormInTable();
    this.productForm = this.fb.group({
      productId: [''],
      productName: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.pattern('^[0-9]*[1-9][0-9]*$')]],
      expiryDate: [''],
      quantity: ['', [Validators.required, Validators.pattern('^[0-9]*[1-9][0-9]*$')]],
      deleteFlag: [''],
      category: this.fb.group({
        categoryId: [''],
        categoryName: ['']
      }),
      unit: this.fb.group({
        unitId: [''],
        unitName: ['']
      }),
      brand: this.fb.group({
        id: [''],
        brandName: ['']
      }),
      imageUrl: [''],
    });

    this.initCreateForm();
    this.getAllData();
    this.getUnit();
    this.getBrand();
    this.getCategory();
  }

  private getAllData(): void {
    this.productService.getPage(this.page.pageable)
      .subscribe(page => {
        this.page = page;
      });
  }

  private getUnit(): void {
    this.productService.findAllUnit().subscribe(data => {
      this.unitList = data;
    });
  }

  private getCategory(): void {
    this.productService.findAllCategory().subscribe(data => {
      this.categoryList = data;
    });
  }

  private getBrand(): void {
    this.productService.findAllBrand().subscribe(data => {
      this.brandList = data;
    });
  }

  public getNextPage(): void {
    this.page.pageable = this.paginationService.getNextPage(this.page);
    this.getAllData();
  }

  public getPreviousPage(): void {
    this.page.pageable = this.paginationService.getPreviousPage(this.page);
    this.getAllData();
  }

  public getPageInNewSize(pageSize: number): void {
    this.page.pageable = this.paginationService.getPageInNewSize(this.page, pageSize);
    this.getAllData();
  }

  editProduct(id: number): void {
    this.productService.findProductById(id).subscribe(next => {

        console.log(next);
        this.productForm.patchValue(next);
        $('#edit1').click();
      },
      error => {
        this.notificationService.edit('Mặt hàng này đã bị xóa');
        this.getAllData();
      });
  }

  onSubmitEdit(): void {
    if (this.productForm.valid) {
      this.productService.updateProduct(this.productForm.value).subscribe(
        next => {
          this.closeEditModal.nativeElement.click();
          this.notificationService.edit('Chỉnh sửa thành công');
          this.getAllData();
        },
        error => console.log(error));
    }
  }

  onCreate(): void {
    this.productService.createNew(this.createProductForm.value).subscribe(
      next => {
        this.closeCreateModal.nativeElement.click();
        this.notificationService.create('Tạo mới thành công');
        this.createProductForm.reset();
        this.initCreateForm();
        this.getAllData();
      },
      error => console.log(error));
  }

  deleteProduct(id: number): void {
    this.productService.findProductById(id).subscribe(next => {
        this.productName = next.productName;
        this.product = next;
        $('#delete1').click();
      },
      error => {
        this.notificationService.edit('Mặt hàng này đã bị xóa');
        this.getAllData();
      });
  }

  OnDelete(): void {
    this.productService.deleteProduct(this.product).subscribe(
      next => {
        this.closeDeleteModal.nativeElement.click();
        this.notificationService.delete('Xóa thành công');
        this.getAllData();
      },
      error => console.log(error)
    );
  }

  OnCancelCreateForm(): void {
    this.closeCreateModal.nativeElement.click();
    this.initCreateForm();
  }

  OnCancelEditForm(): void {
    this.closeCreateModal.nativeElement.click();
    this.productForm.reset();
  }

  sortName(key): void {
    this.key = key;
    this.reverse = !this.reverse;
  }

  initCreateForm(): void {
    this.createProductForm = this.fb.group({
      productName: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]*[1-9][0-9]*$')]],
      expiryDate: [''],
      quantity: ['', [Validators.required, Validators.pattern('^[0-9]*[1-9][0-9]*$')]],
      deleteFlag: [0],
      category: this.fb.group({
        categoryId: ['']
      }),
      unit: this.fb.group({
        unitId: ['']
      }),
      brand: this.fb.group({
        id: ['']
      }),
    });
  }

  onOptionSelected(categoryId: string): void {
    if (categoryId === '') {
      this.brandArray = [];
    } else {
      this.productService.findBrandByCategoryId(categoryId)
        .subscribe(data => {
          this.listBrand = data;
        }, () => {
          console.log('error');
        }, () => {
          this.brandArray = [];
          for (const product of this.listBrand) {
            this.brandArray.push(product.brand);
          }
        });
    }

  }

  findProductByCategoryAndBrand(categoryId: string, brandId: string): void {
    if (categoryId === '' && brandId === '') {
      this.getAllData();
    } else if (categoryId !== '' && brandId === '') {
      this.productService.findAllProductByCategory(categoryId, this.page.pageable).subscribe(
        data => {
          this.page = data;
        }, () => {
          console.log('can not get product');
        }
      );
    } else {
      this.productService.findAllProductByCategoryAndBrand(categoryId, brandId, this.page.pageable).subscribe(
        data => {
          this.page = data;
        }, () => {
          console.log('can not get product');
        });
    }
  }

  searchProducts(categoryId: string, brandId: string, productName: string, price: string): void {
    const FIND_ALL = categoryId === '' && brandId === '' && productName === '' && price === '';
    const FIND_CATEGORY = categoryId !== '' && brandId === '' && productName === '' && price === '';
    const FIND_CATEGORY_BRAND = categoryId !== '' && brandId !== '' && productName === '' && price === '';
    const FIND_CATEGORY_NAME = categoryId !== '' && brandId === '' && productName !== '' && price === '';
    const FIND_CATEGORY_PRICE = categoryId !== '' && brandId === '' && productName === '' && price !== '';
    const FIND_PRODUCT_NAME = categoryId === '' && brandId === '' && productName !== '' && price === '';
    const FIND_PRICE = categoryId === '' && brandId === '' && productName === '' && price !== '';
    const FIND_NAME_PRICE = categoryId === '' && brandId === '' && productName !== '' && price !== '';
    const FIND_CATEGORY_NAME_PRICE = categoryId !== '' && brandId === '' && productName !== '' && price !== '';
    const FIND_CATEGORY_BRAND_PRICE = categoryId !== '' && brandId !== '' && productName === '' && price !== '';
    const FIND_CATEGORY_BRAND_NAME = categoryId !== '' && brandId !== '' && productName !== '' && price === '';
    const FIND_CATEGORY_BRAND_NAME_PRICE = categoryId !== '' && brandId === '' && productName !== '' && price !== '';
    switch (true) {
      case FIND_ALL :
        this.getAllData();
        break;
      case FIND_CATEGORY :
        this.findByCategory(categoryId);
        break;
      case FIND_CATEGORY_BRAND :
        this.findByCategoryAndBrand(categoryId, brandId);
        break;
      case FIND_CATEGORY_NAME :
        this.findByCategoryAndName(categoryId, productName);
        break;
      case FIND_CATEGORY_PRICE :
        this.findByCategoryPrice(categoryId, price);
        break;
      case FIND_PRODUCT_NAME :
        this.findByName(productName);
        break;
      case FIND_PRICE :
        this.findByPrice(price);
        break;
      case FIND_NAME_PRICE :
        this.findByNameAndPrice(productName, price);
        break;
      case FIND_CATEGORY_NAME_PRICE :
        this.findByCategoryNamePrice(categoryId, productName, price);
        break;
      case FIND_CATEGORY_BRAND_NAME :
        this.findByCategoryBrandName(categoryId, brandId, productName);
        break;
      case FIND_CATEGORY_BRAND_PRICE :
        this.findAllByCategoryBrandProductNamePrice(categoryId, brandId, price);
        break;
      case FIND_CATEGORY_BRAND_NAME_PRICE :
        this.findByCategoryBrandNamePrice(categoryId, brandId, productName, price);
        break;
    }
  }

  private findByCategoryPrice(categoryId: string, price: string): void {
    this.productService.findAllByCategoryAndPrice(categoryId, price, this.page.pageable).subscribe(data => {
      this.page = data;
    }, () => {
      console.log('findAllByCategoryAndPrice: error');
    });
  }

  private findByCategoryNamePrice(categoryId: string, productName: string, price: string): void {
    this.productService.findAllByCategoryNamePrice(categoryId, productName, price, this.page.pageable).subscribe(data => {
      this.page = data;
    }, () => {
      console.log('findAllByCategoryNamePrice: error');
    });
  }

  private findByCategoryAndName(categoryId: string, productName: string): void {
    this.productService.findAllByCategoryAndName(categoryId, productName, this.page.pageable).subscribe(data => {
      this.page = data;
    }, () => {
      console.log('findAllByCategoryAndName: error');
    });
  }

  private findByCategoryBrandName(categoryId: string, brandId: string, productName: string): void {
    this.productService.findAllByCategoryBrandProductName(categoryId, brandId, productName, this.page.pageable).subscribe(data => {
      this.page = data;
    }, () => {
      console.log('findAllByCategoryBrandProductName: error');
    });
  }

  private findByCategoryAndBrand(categoryId: string, brandId: string): void {
    this.productService.findAllProductByCategoryAndBrand(categoryId, brandId, this.page.pageable).subscribe(
      data => {
        this.page = data;
      }, () => {
        console.log('findAllProductByCategoryAndBrand: error');
      });
  }

  private findByCategoryBrandNamePrice(categoryId: string, brandId: string, productName: string, price: string): void {
    // tslint:disable-next-line:max-line-length
    this.productService.findAllByCategoryBrandProductNamePrice(categoryId, brandId, productName, price, this.page.pageable).subscribe(data => {
      this.page = data;
    }, () => {
      console.log('findByCategoryBrandNamePrice error: no result');
    }, () => {
      // if (this.page.content.length === 0) {
      //   alert('not found');
      // }
    });
  }

  private findAllByCategoryBrandProductNamePrice(categoryId: string, brandId: string, price: string): void {
    this.productService.findAllByCategoryBrandPrice
    (categoryId, brandId, price, this.page.pageable).subscribe(data => {
      this.page = data;
    }, () => {
      console.log('findByCategoryProductNamePrice: no result');
    });
  }

  private findByPrice(price: string): void {
    this.productService.findAllByPrice(price, this.page.pageable).subscribe(data => {
      this.page = data;
    }, () => {
      console.log('find by Price: error');
    });
  }

  private findByNameAndPrice(productName: string, price: string): void {
    this.productService.findAllByNameAndPrice(productName, price, this.page.pageable).subscribe(data => {
      this.page = data;
    }, () => {
      console.log('find by productNameAndPrice: no result');
    });
  }

  private findByName(productName: string): void {
    this.productService.findAllByName(productName, this.page.pageable).subscribe(data => {
      this.page = data;
    }, () => {
      console.log('find by productName: no result');
    });
  }

  private findByCategory(categoryId: string): void {
    this.productService.findAllProductByCategory(categoryId, this.page.pageable).subscribe(data => {
      this.page = data;
    }, () => {
      console.log('find by Category: no result ');
    });
  }

  buildFormInTable(): FormGroup {
    return this.fb.group({
      productName: ['', Validators.required],
      price: ['', [Validators.required], Validators.pattern('^[0-9]*[1-9][0-9]*$')],
      expiryDate: ['', [Validators.required]],
      quantity: ['', [Validators.required], Validators.pattern('^[0-9]*[1-9][0-9]*$')],
      deleteFlag: [0],
      category: this.fb.group({
        categoryId: ['', [Validators.required]]
      }),
      unit: this.fb.group({
        unitId: ['', [Validators.required]]
      }),
      brand: this.fb.group({
        id: ['', [Validators.required]]
      }),
    });
  }

  addRow(): void {
    this.formArray.push(this.buildFormInTable());
  }

  removeRow(index: number): void {
    this.formArray.removeAt(index);
  }

  onSubmitMultipleRow(formArray): void {
    for (const value of formArray.value) {
      this.productService.createNew(value).subscribe(
        () => {
          this.notificationService.create('Tạo mới thành công');
          this.formArray.clear();
        },
        error => console.log(error),
        () => {
          this.getAllData();
        });
    }
  }

  onSubmitSingleRow(formArray, index): void {
    console.log('index cua form: ' + index);
    console.log(formArray.at(index).value);
    this.productService.createNew(formArray.at(index).value).subscribe(
      () => {
        this.removeRow(index);
        this.notificationService.create('Tạo mới thành công');
        this.getAllData();
      },
      error => console.log(error));
  }
}
