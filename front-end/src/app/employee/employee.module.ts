import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EmployeeRoutingModule} from './employee-routing.module';
import {RouterModule} from '@angular/router';
import {PartnerManagementComponent} from './partner-management/partner-management.component';
import {WarehouseManagementComponent} from './warehouse-management/warehouse-management.component';
import {HomeComponent} from './warehouse-management/home/home.component';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {Ng2OrderModule} from 'ng2-order-pipe';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ProductComponent} from './warehouse-management/product/product.component';
import {MaterialModule} from '../shares/material.module';
import {EmployeeDetailComponent} from './employee-manager/employee-detail/employee-detail.component';
import {MatDialogModule} from '@angular/material/dialog';
import {ShareModule} from '../shares/share.module';
import {EmployeeManagerComponent} from './employee-manager/employee-manager.component';
import {ListDistributorComponent} from './partner-management/list-distributor/list-distributor.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MatCardModule} from '@angular/material/card';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {CustomerManagementComponent} from './partner-management/customer-management/customer-management.component';
import {BrandManagementComponent} from './warehouse-management/brand-management/brand-management.component';
import {CustomPaginationComponent} from './warehouse-management/product/custom-pagination/custom-pagination.component';
import {BrandService} from '../services/brand.service';
import {NgxPaginationModule} from 'ngx-pagination';
// @ts-ignore
import {AngularFireModule} from '@angular/fire';
// @ts-ignore
import {AngularFireStorageModule} from '@angular/fire/storage';
// @ts-ignore
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {MatPaginatorModule} from '@angular/material/paginator';
import {FilterProductPipe} from './warehouse-management/product/filter-product.pipe';
import {FilterMultiplePipe} from './warehouse-management/product/filter-multiple.pipe';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {FacebookModule} from 'ngx-facebook';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {FilterUniquePipe} from './warehouse-management/product/filter-unique.pipe';
import {BillComponent} from './warehouse-management/bill/bill.component';
import {NgSelectModule} from '@ng-select/ng-select';
import { ProductSaleComponent } from './sale-management/product-sale/product-sale.component';

import {SaleManagementComponent} from './partner-management/sale-management/sale-management.component';
// @ts-ignore
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {SalesManagementComponent} from './sale-management/sale-management.component';
import {CarouselModule} from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [PartnerManagementComponent, EmployeeDetailComponent, EmployeeManagerComponent,
    WarehouseManagementComponent, HomeComponent, ProductComponent, ListDistributorComponent,
    BillComponent, BrandManagementComponent, CustomerManagementComponent, CustomPaginationComponent,
    FilterProductPipe, FilterMultiplePipe, FilterUniquePipe, SaleManagementComponent,SalesManagementComponent, ProductSaleComponent],
  exports: [
    WarehouseManagementComponent,
    PartnerManagementComponent,
    HomeComponent
  ],
  imports:
    [
      CommonModule,
      EmployeeRoutingModule,
      RouterModule,
      ReactiveFormsModule,
      Ng2SearchPipeModule,
      Ng2OrderModule,
      HttpClientModule,
      NgbModule,
      MaterialModule,
      MatDialogModule,
      ShareModule,
      MatCardModule,
      NgxPaginationModule,
      AngularFireStorageModule,
      AngularFireDatabaseModule,
      MatPaginatorModule,
      AngularFireModule.initializeApp({
        apiKey: 'AIzaSyAFbHzEL2J7oXY5bWTF6dA3DnO_iCj5W48',
        authDomain: 'webapp-1b736.firebaseapp.com',
        databaseURL: 'https://webapp-1b736.firebaseio.com',
        projectId: 'webapp-1b736',
        storageBucket: 'webapp-1b736.appspot.com',
        messagingSenderId: '1077539336649',
        appId: '1:1077539336649:web:e5fbf4e6a877218b887818',
        measurementId: 'G-N3YS1JFN9K'
      }),
      AngularFirestoreModule,
      AngularFireAuthModule,
      FacebookModule.forRoot(),
      MatProgressBarModule,
      NgSelectModule,
      BsDatepickerModule.forRoot(),
      CarouselModule
    ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    BrandService,
  ]
})

export class EmployeeModule {
}
