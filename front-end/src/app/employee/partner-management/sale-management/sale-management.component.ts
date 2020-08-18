import {Component, OnInit, ViewChild} from '@angular/core';
import {EmployeeService} from '../../../services/employee.service';
import {CustomerService} from '../../../services/customer.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CouponService} from '../../../services/coupon.service';
import {AdminService} from '../../../services/admin.service';
import {Coupon} from '../../../models/coupon';
import {ToastrService} from 'ngx-toastr';
declare const checkAll: any;
import * as $ from 'jquery';
@Component({
  selector: 'app-sale-management',
  templateUrl: './sale-management.component.html',
  styleUrls: ['./sale-management.component.scss']
})
export class SaleManagementComponent implements OnInit {
  @ViewChild('closeDeleteModal') closeDeleteModal;
  @ViewChild('closeDeleteManyModal') closeDeleteManyModal;
  userName: any;
  employeeList = [];
  customerList = [];
  couponList = [];
  size = 4;
  pages = [];
  createDateFrom = '';
  createDateTo = '';
  employee = '';
  customer = '';
  searchCouponForm: FormGroup;
  pageClicked = 0;
  totalPages = 1;
  coupon: Coupon;
  couponId: number;
  deleteList = new Array();
  constructor(private employeeService: EmployeeService,
              private customerService: CustomerService,
              private adminService: AdminService,
              private couponService: CouponService,
              private formBuilder: FormBuilder,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    checkAll();
    this.searchCouponForm = this.formBuilder.group({
      employee: [''],
      user: [''],
      createDateFrom: [''],
      createDateTo: [''],
    });

    this.employeeService.findAll().subscribe(next => {
      this.employeeList = next;
    }, error => {
      console.log(error);
    });

    this.customerService.getAllCustomer().subscribe(next => {
      this.customerList = next;
    }, error => {
      console.log(error);
    });
    this.getAllCoupon(0);
  }


  getAllCoupon(page): void {
    this.couponService.getAllCourse(page, this.size, this.createDateFrom, this.createDateTo, this.employee,
      this.customer).subscribe(next => {
      if (next !== null) {
        this.pageClicked = page;
        this.totalPages = next.totalPages;
        this.pages = Array.apply(null, {length: this.totalPages}).map(Number.call, Number);
        this.couponList = next.content;
      } else {
        this.pageClicked = 0;
        this.totalPages = 1;
        this.pages = [];
        this.couponList = null;
      }
    }, error => {
      console.log(error);
    });
  }

  search(): void {
    if (this.searchCouponForm.value.createDateFrom !== '') {
      this.createDateFrom =
        this.searchCouponForm.value.createDateFrom.toLocaleDateString().split('/')[2]
        + '-' + this.searchCouponForm.value.createDateFrom.toLocaleDateString().split('/')[1]
        + '-' + this.searchCouponForm.value.createDateFrom.toLocaleDateString().split('/')[0];
    }
    if (this.searchCouponForm.value.createDateTo !== '') {
      this.createDateTo =
        this.searchCouponForm.value.createDateTo.toLocaleDateString().split('/')[2]
        + '-' + this.searchCouponForm.value.createDateTo.toLocaleDateString().split('/')[1]
        + '-' + this.searchCouponForm.value.createDateTo.toLocaleDateString().split('/')[0];
    }
    if (this.searchCouponForm.value.employee === 'Tất cả') {
      this.employee = '';
    } else {
      this.employee = this.searchCouponForm.value.employee;
    }
    if (this.searchCouponForm.value.user === 'Tất cả') {
      this.customer = '';
    } else {
      this.customer = this.searchCouponForm.value.user;
    }
    this.getAllCoupon(0);
  }

  onPrevious(): void {
    if (this.pageClicked > 0) {
      this.pageClicked--;
      this.getAllCoupon(this.pageClicked);
    }
  }

  onNext(): void {
    if (this.pageClicked < this.totalPages - 1) {
      this.pageClicked++;
      this.getAllCoupon(this.pageClicked);
    }
  }

  onLast(): void {
    this.pageClicked = this.totalPages - 1;
    this.getAllCoupon(this.pageClicked);
  }

  showDeleteError(): void {
    this.toastr.error('Không thể xóa!');
  }

  showDeleteSuccess(): void {
    this.toastr.success('Xóa thành công!');
  }

  showDeleteWarning(): void {
    this.toastr.error('Chưa có phiếu được chọn!');
  }

  deleteCoupon(id: number): void {
    this.couponService.findCouponById(id).subscribe(next => {
        this.coupon = next;
        this.couponId = next.couponId;
      },
      error => {
        console.log(error);
        this.showDeleteError();
        this.ngOnInit();
      });
  }

  onDelete(): void {
    this.couponService.deleteCoupon(this.coupon).subscribe(
      next => {
        this.closeDeleteModal.nativeElement.click();
        this.showDeleteSuccess();
        this.ngOnInit();
      },
      error => console.log(error)
    );
  }

  selectCheckBox(event, id): void {
    const indexOfId = this.deleteList.indexOf(id);
    if (event.target.checked) {
      if (indexOfId < 0) {
        this.deleteList.push(id);
        console.log(this.deleteList.indexOf(id));
      }
    } else {
      this.deleteList.splice(indexOfId, 1);
    }
  }

  selectAllCheckBox(event): void {
    if (event.target.checked) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.couponList.length; i++) {
        this.deleteList.push(this.couponList[i].couponId);
        console.log(this.couponList[i]);
      }
    } else {
      this.deleteList.splice(0, this.deleteList.length);
    }
  }

  deleteManyCoupon(): void {
    if (this.deleteList.length <= 0) {
      this.showDeleteWarning();
    } else {
      $('#deleteMany').click();
    }
  }
  onDeleteMany(): void {
    for (let i = 0; i < this.deleteList.length; i++) {
      this.couponService.deleteManyCoupon(this.deleteList[i]).subscribe(
        next => {
          this.closeDeleteManyModal.nativeElement.click();
          this.showDeleteSuccess();
          this.emptyDeleteList();
          $('#checkAll').prop('checked',false);
          this.ngOnInit();
        },
      error => console.log(error)
    );
    }
  }
  emptyDeleteList(): void{
    this.deleteList.length = 0;
  }
}

