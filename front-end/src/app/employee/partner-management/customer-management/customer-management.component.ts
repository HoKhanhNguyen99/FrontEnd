import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnChanges, OnInit} from '@angular/core';
import {CustomerService} from '../../../services/customer.service';
import {Customer} from '../../../models/customer';
import {HttpClient} from '@angular/common/http';
import {finalize, map} from 'rxjs/operators';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';
import {} from '../../../../assets/js/fb.js';
import {ToastrService} from 'ngx-toastr';
import {OrderService} from '../../../services/order.service';
import {Order} from '../../../models/order';
import {NgbDate, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';


declare var $: any;

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.scss']
})
export class CustomerManagementComponent implements OnInit {
  p = 1;
  size = 5;
  search = '';
  // tslint:disable-next-line:variable-name
  birthday_value: NgbDateStruct;
  value1 = '';
  value2 = '';
  pageClicked = 0;
  pages = [];
  totalPages = 1;
  customers: Customer[];
  tempCustomer: Customer = new Customer();
  addUser: FormGroup;
  customer = new Customer();
  reverse = false;
  filter;
  date = new Array<any>();
  deleteList = new Array();
  cantDeleteList = new Array();
  selectedFile = null;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  editUrl = new Array<any>();
  uploadStatus = new Array<boolean>();
  uploadProgress = new Array<any>();
  uploadProgressStatus = new Array<boolean>();
  percentUpload: any;
  curentDay = new Date();
  maxDate = new Date();
  minDate = new Date();
  orders: Order[];
  deleteCheckOrderValue = ['Giao hàng thành công', 'Đã hủy'];
  dateRequired = new Array<boolean>();
  dateRegex = new Array<boolean>();
  dateOutRange = new Array<boolean>();
  edited = [];
  editFormTest = new Array<FormGroup>();
  customerEditList = [];
  private hasSearch = false;
  validationMessages = {
    fullName: [
      {type: 'minlength', message: 'Tên nên có ít nhất 5 ký tự'},
      {type: 'maxlength', message: 'Tên có độ dài vượt quá 25 ký tự'},
      {type: 'required', message: 'Tên không được để trống'},
      {type: 'pattern', message: 'Tên không đúng định dạng'}
    ],
    gender: [
      {type: 'required', message: 'Tên của khóa học không được để trống.'},
    ],
    // identityNumber: [
    //   {type: 'required', message: 'Vui lòng nhập vào'},
    //   {type: 'pattern', message: 'Nhập sai định dạng Vd:205443374'}
    // ],
    email: [
      {type: 'required', message: 'Vui lòng nhập vào'},
      {type: 'pattern', message: 'Nhập sai định dạng Vd:caoquochuy21@gmail.com'}
    ],
    phone: [
      {type: 'required', message: 'Vui lòng nhập vào'},
      {type: 'pattern', message: 'Nhập sai định dạng Vd:0908123123'}
    ],
    birthday: [
      {type: 'required', message: 'Vui lòng nhập vào'},
      {type: 'invalid', message: 'Không đủ 18 tuổi'}
    ],
  };

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private customerService: CustomerService,
              private http: HttpClient,
              private afStorage: AngularFireStorage,
              private toastr: ToastrService,
              private orderService: OrderService) {
  }

  validatingForm: FormGroup;

  ngOnInit(): void {
    this.addUser = this.formBuilder.group({
      userName: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(25),
        Validators.minLength(5),
        Validators.pattern(/^\S+.*\S+$/)
      ])),
      gender: ['', [Validators.required]],
      birthday: new FormControl('', Validators.compose([
        Validators.required,
        this.checkBirthDay,
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      phone: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(?:\\(84\\)\\+|0)9[01]\\d{7}$')
      ])),
      address: ['', [Validators.required]],
      imageUrl: ['']
    });
    this.onSubmit(0);
    // tslint:disable-next-line:typedef
    $('#checkAll').click(function() {
      $('input:checkbox').not(this).prop('checked', this.checked);
    });
    // this.editUser = this.formBuilder.group({
    //   id: [''],
    // tslint:disable-next-line:max-line-length
    //   userName: ['', [Validators.required, Validators.pattern('[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹế][a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹế ]*')]],
    //   address: ['', Validators.required],
    //   phone: ['', [Validators.required, Validators.pattern('(090|091|\\(84\\)\\+90|\\(84\\)\\+91)[0-9]{7}')]],
    //   email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9]+(\\.?[A-Za-z0-9])*@[A-Za-z0-9]+(\\.[A-Za-z0-9]+)')]],
    //   birthday: [''],
    //   gender: [''],
    //   imageUrl: ['']
    // });
    // this.customerService.getAllCustomer().subscribe((data: any) => {
    //     this.customers = data.content;
    //     for (let i = 0; i < this.customers.length; i++) {
    //       this.customerEditList[i] = [];
    //       this.customerEditList[i][0] = this.customers[i];
    //       this.customerEditList[i][1] = false;
    //       this.uploadProgressStatus[this.customerEditList[i][0].id] = false;
    //       this.uploadStatus[this.customerEditList[i][0].id] = true;
    //       this.dateRequired[this.customerEditList[i][0].id] = false;
    //       this.dateRegex[this.customerEditList[i][0].id] = false;
    //       this.dateOutRange[this.customerEditList[i][0].id] = false;
    //     }
    //     for (let i = 0; i < this.customers.length; i++) {
    //       this.editFormTest.push(this.formBuilder.group({
    //           id: [''],
    // tslint:disable-next-line:max-line-length
    //           userName: ['', [Validators.required, Validators.pattern('[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹế][a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹế ]*')]],
    //           address: ['', Validators.required],
    //           phone: ['', [Validators.required, Validators.pattern('(090|091|\\(84\\)\\+90|\\(84\\)\\+91)[0-9]{7}')]],
    //           email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9]+(\\.?[A-Za-z0-9])*@[A-Za-z0-9]+(\\.[A-Za-z0-9]+)')]],
    //           birthday: [''],
    //           gender: [''],
    //           imageUrl: ['']
    //         })
    //       )
    //
    //     }
    //   }, error => {
    //     console.log(error);
    //   }, () => {
    //   }
    // );
    // this.maxDate.setFullYear(this.curentDay.getFullYear() - 2);
    // this.minDate.setFullYear(this.curentDay.getFullYear() - 120);

    // tslint:disable-next-line:typedef
    $('#checkAll').click(function() {
      $('input:checkbox').not(this).prop('checked', this.checked);
    });
    this.addUser = this.formBuilder.group({
      id: [''],
      userName: ['', [Validators.required, Validators.pattern('[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹế][a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹế ]*')]],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('(090|091|\\(84\\)\\+90|\\(84\\)\\+91)[0-9]{7}')]],
      email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9]+(\\.?[A-Za-z0-9])*@[A-Za-z0-9]+(\\.[A-Za-z0-9]+)')]],
      birthday: [''],
      gender: [''],
      imageUrl: ['']
    });
    // tslint:disable-next-line:only-arrow-functions typedef no-shadowed-variable
    (function($) {
      // tslint:disable-next-line:only-arrow-functions typedef
      $(document).ready(function() {
        // tslint:disable-next-line:only-arrow-functions typedef
        const readURL = function(input) {
          if (input.files && input.files[0]) {
            const reader = new FileReader();

            // tslint:disable-next-line:only-arrow-functions typedef
            reader.onload = function(e) {
              // @ts-ignore
              $('.profile-pic').attr('src', e.target.result);
            };

            reader.readAsDataURL(input.files[0]);
          }
        };

        // tslint:disable-next-line:typedef
        $('#custom-file-input').on('change', function() {
          readURL(this);
        });

        // tslint:disable-next-line:only-arrow-functions typedef
        $('#upload-button').on('click', function() {
          $('#file-upload').click();
        });

      });

    })(jQuery);
    $('.icon-upload-alt').css('opacity', '-1');
    // tslint:disable-next-line:typedef
    $('.button').click(function() {
      const buttonId = $(this).attr('id');
      $('#modal-container').removeAttr('class').addClass(buttonId);
      $('body').addClass('modal-active');
    });

    // tslint:disable-next-line:typedef
    $('#modal-container').click(function() {
      $(this).addClass('out');
      $('body').removeClass('modal-active');
    });

  }


  editModel(element: Customer): void {
    this.uploadProgressStatus[this.customer.id] = false;
    this.tempCustomer = element;
    this.change();
    $('#editModal').modal('show');
  }

  deleteModel(element: Customer): void {
    this.tempCustomer = element;
    this.change();
    $('#deleteModal').modal('show');
  }

  editMultiModel(): void {
    $('#editMultiModal').modal('show');
  }

  // deleteSelectedModel() {
  //   $('#deleteSelectedModal').modal('show');
  // }

  backMenu(): void {
    $('#addModal').modal('hide');
    $('#addCheckModal').modal('hide');
    $('#editModal').modal('hide');
    $('#DeleteModal').modal('hide');
    $('#editcheckModal').modal('hide');
    $('#deletecheckModal').modal('hide');
  }

  addModel(): void {
    $('#addModal').modal('show');
  }

  addCheckModel(element: Customer): void {
    $('#addCheckModal').modal('show');
  }

  onSubmit(page): void {
    this.customerService.getAllCustomerWithSearchAndPageAndFilter(page, this.size, this.search, this.value1, this.value2).subscribe(
      data => {
        // console.log(data);
        this.pageClicked = page;
        this.customers = data.content;
        this.totalPages = data.totalPages;
        this.pages = Array.apply(null, {length: this.totalPages}).map(Number.call, Number);
      }, error => {
        if (error.status === 401) {
          alert('Bạn không có quyền vào trang này.Mời bạn đăng nhập.');
        }
      }
    );
    // if (this.uploadStatus) {
    //   const editConfirm = confirm('Bạn có chắc chắn cập nhật thông tin của khách mua hàng ?');
    //   if (editConfirm) {
    //     if (this.date !== undefined) {
    //       this.addUser.patchValue({
    //         birthday: this.date,
    //       });
    //     }
    //     if (this.editUrl !== undefined) {
    //       this.addUser.patchValue({
    //         imageUrl: this.editUrl,
    //       });
    //     }
    //     this.customerService.editCustomer(this.addUser.value).subscribe(
    //       next => {
    //         window.location.reload();
    //       },
    //       error => console.log(error)
    //     );
    //   }
    // }
  }

  // tslint:disable-next-line:typedef
  editSubmit(userName, id) {
    if (this.uploadStatus[id]) {
      if (this.date[id] !== undefined) {
        this.addUser.patchValue({
          birthday: this.date[id],
        });
      }
      if (this.editUrl[id] !== undefined) {
        this.addUser.patchValue({
          imageUrl: this.editUrl[id],
        });
      }
      this.customerService.editCustomer(this.addUser.value).subscribe(
        next => {
          $('#editModal').modal('hide');
          this.ngOnInit();
          console.log(this.edited[id] = true);
          // $('#edited' + id).css('background-color', 'black');
          this.toastr.success('Thay đổi thành công thông tin của khách hàng ' + userName + ' !');
        },
        error => console.log(error)
      );

    }
  }

  deleteSubmit(id, userName): void {
    this.orderService.findAllOrderByUserId(id).subscribe((next: any) => {
        $('#deleteModal').modal('hide');
        this.orders = next.content;
        if (this.checkDeleteOrder()) {
          this.toastr.error('Khách hàng ' + userName + ' đang đặt hàng, không thể xóa!');
        } else {
          this.deleteSubmitConfirm(id, userName);
        }
      },
      error => {
        console.log(error);
        this.orders = null;
        this.deleteSubmitConfirm(id, userName);
      });
  }

  deleteSubmitConfirm(id, userName): void {
    this.customerService.deleteCustomerById(id).subscribe(
      next => {
        this.ngOnInit();
        this.toastr.success('Xóa thành công khách hàng ' + userName + ' !');
      },
      error => console.log(error)
    );
  }

  change(): void {
    this.addUser.patchValue({
      id: this.tempCustomer.id,
      userName: this.tempCustomer.userName,
      birthday: this.tempCustomer.birthday,
      address: this.tempCustomer.address,
      email: this.tempCustomer.email,
      phone: this.tempCustomer.phone,
      gender: this.tempCustomer.gender,
      imageUrl: this.tempCustomer.imageUrl,
      deleteFlag: this.tempCustomer.deleteFlag,
    });
  }

  addEvent(event, id): void {
    this.date[id] = event.value;
    this.dateRequired[id] = false;
    this.dateRegex[id] = false;
    this.dateOutRange[id] = false;
  }

  deleteCheckbox(event, id): void {
    this.orders = null;
    const indexOfIdTrue = this.deleteList.indexOf(id);
    const indexOfIdFalse = this.cantDeleteList.indexOf(id);
    if (event.target.checked) {
      if (indexOfIdTrue < 0 || indexOfIdFalse < 0) {
        this.orderService.findAllOrderByUserId(id).subscribe((next: any) => {
            this.orders = next.content;
            if (this.checkDeleteOrder()) {
              this.cantDeleteList.push(id);
            } else {
              this.deleteList.push(id);
            }
          },
          error => {
            console.log(error);
            this.orders = null;
            this.deleteList.push(id);
          });
        // this.deleteList.push(id);
      }
    } else {
      if (indexOfIdTrue >= 0) {
        this.deleteList.splice(indexOfIdTrue, 1);
      }
      if (indexOfIdFalse >= 0) {
        this.cantDeleteList.splice(indexOfIdFalse, 1);
      }
    }

  }

  deleteAllCheckbox(event): void {
    if (event.target.checked) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.customers.length; i++) {
        this.deleteCheckbox(event, this.customers[i].id);
      }
    } else {
      this.deleteList.splice(0, this.deleteList.length);
      this.cantDeleteList.splice(0, this.cantDeleteList.length);
    }
  }

  delete(): void {
    const deleteConfirm = false;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.deleteList.length; i++) {
      this.customerService.deleteCustomerById(this.deleteList[i]).subscribe(
        next => {
          $('#checkAll').prop('checked', false);
          this.ngOnInit();
          this.customers = [];
          this.deleteList = [];
        },
        error => console.log(error)
      );
    }
    this.toastr.success('Xóa thành công ' + this.deleteList.length + ' khách hàng !');
    if (this.cantDeleteList.length > 0) {
      this.toastr.error('Có ' + this.cantDeleteList.length + ' khách hàng không thể xóa!');
    }
  }

  // tslint:disable-next-line:typedef
  hoverUploadPic(id) {
    $('.icon-upload-alt' + id).css('opacity', '0.8');
  }

  hoverUploadPicture(): void {
    $('.icon-upload-alt').css('opacity', '0.8');
  }

  // leaveUploadPic(id) {
  //   $('.icon-upload-alt' + id).css('opacity', '-1');
  // }
  // leaveUploadPic_(): void {
  //   $('.icon-upload-alt').css('opacity', '-1');
  // }
  //
  // selectAvatar(id) {
  //   $('#myAvatar' + id).click();
  //   this.uploadProgressStatus[id] = true;
  // }
  selectAvatar_(): void {
    $('#myAvatar').click();
    $('#myAvatar1').click();
  }

  readURL(target: any, id): void {
    this.uploadStatus[id] = false;
    if (target.files && target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // @ts-ignore
        $('#avatar' + id).attr('src', e.target.result);
      };
      reader.readAsDataURL(target.files[0]);
      this.uploadFireBaseAndSubmit(id);
    } else {
    }
  }

  private uploadFireBaseAndSubmit(customerId): void {
    const target: any = document.getElementById('myAvatar' + customerId);
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(id);
    this.task = this.ref.put(target.files[0]);
    if (!this.uploadStatus[customerId]) {
      this.percentUpload = this.task.snapshotChanges()
        .pipe(map(s => (s.bytesTransferred / s.totalBytes) * 100));
      this.uploadProgress[customerId] = this.task.percentageChanges();
    }
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.ref.getDownloadURL().subscribe(url => {
          this.editUrl[customerId] = url;
          this.uploadStatus[customerId] = true;
        });
      }))
      .subscribe();
  }

  checkDeleteOrder(): boolean {
    let statusDelete = false;
    this.orders.forEach(order => {
      if (order.orderStatus !== this.deleteCheckOrderValue[0] && order.orderStatus !== this.deleteCheckOrderValue[1]) {
        statusDelete = true;
      }
    });
    return statusDelete;
  }

  // dateValidate(event, id, index) {
  //   this.dateRequired[id] = false;
  //   this.dateRegex[id] = false;
  //   this.dateOutRange[id] = false;
  //   const eventString = event.toString();
  //   const nullValue = "";
  //   if (eventString == nullValue) {
  //     this.dateRequired[id] = true;
  //   } else {
  //     let check = eventString.split('/');
  //     const checkDay = check[0].match('(0[1-9]|[1-2][0-9]|3[0-1])');
  //     const checkMonth = check[1]?.match('(0[0-9]|1[0-2])');
  //     const checkYear = check[2]?.match('[0-9]{4}');
  //     var dateObject = new Date(+check[2], check[1] - 1, +check[0]);
  //     console.log(dateObject);
  // tslint:disable-next-line:max-line-length
  //     const regExp = '^(?:(?:31(\\/|-|\\.)(?:0?[13578]|1[02]))\\1|(?:(?:29|30)(\\/|-|\\.)(?:0?[13-9]|1[0-2])\\2))(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$|^(?:29(\\/|-|\\.)0?2\\3(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\\d|2[0-8])(\\/|-|\\.)(?:(?:0?[1-9])|(?:1[0-2]))\\4(?:(?:1[6-9]|[2-9]\\d)?\\d{2})$';
  //     if (eventString.match(regExp) && checkDay && checkMonth && checkYear) {
  //       if (dateObject.getFullYear() <= this.minDate.getFullYear() || dateObject.getFullYear() >= this.maxDate.getFullYear()) {
  //         this.dateOutRange[id] = true;
  //       } else {
  //         this.date[id] = dateObject;
  //         this.editFormTest[index].patchValue({
  //           birthday: dateObject,
  //         })
  //       }
  //     } else {
  // tslint:disable-next-line:max-line-length
  //       if ((dateObject.getFullYear() <= this.minDate.getFullYear() || dateObject.getFullYear() >= this.maxDate.getFullYear()) && check[2] !== nullValue) {
  //         this.dateOutRange[id] = true;
  //       } else {
  //         this.dateRegex[id] = true;
  //       }
  //     }
  //   }
  // }

  // editModelTest(index): void {
  //   // $('#edit-inline-animate1-'+index).animate({height: "+=500"}, 1000);
  //   this.uploadProgressStatus[this.customerEditList[index][0].id] = false;
  //   this.changeTest(index);
  //   this.customerEditList[index][1] = true;
  // }

  // changeTest(index) {
  //   this.editFormTest[index].patchValue({
  //     id: this.customerEditList[index][0].id,
  //     userName: this.customerEditList[index][0].userName,
  //     birthday: this.customerEditList[index][0].birthday,
  //     address: this.customerEditList[index][0].address,
  //     email: this.customerEditList[index][0].email,
  //     phone: this.customerEditList[index][0].phone,
  //     gender: this.customerEditList[index][0].gender,
  //     imageUrl: this.customerEditList[index][0].imageUrl,
  //     deleteFlag: this.customerEditList[index][0].deleteFlag,
  //   });
  // }

  // editSubmitTest(index, userName) {
  //   if (this.uploadStatus[this.customerEditList[index][0].id]) {
  //     if (this.date[this.customerEditList[index][0].id] !== undefined) {
  //       this.editFormTest[index].patchValue({
  //         birthday: this.date[this.customerEditList[index][0].id]
  //       });
  //     }
  //     if (this.editUrl[this.customerEditList[index][0].id] !== undefined) {
  //       this.editFormTest[index].patchValue({
  //         imageUrl: this.editUrl[this.customerEditList[index][0].id],
  //       });
  //     }
  //     this.customerService.editCustomer(this.editFormTest[index].value).subscribe(
  //       next => {
  //         this.reloadEditTest(index);
  //         this.customerEditList[index][1] = false;
  //         this.edited[index] = true;
  //         this.toastr.success('Thay đổi thành công thông tin của khách hàng ' + userName + ' !');
  //       },
  //       error => console.log(error)
  //     );
  //   }
  // }

  // reloadEditTest(index) {
  //   this.customerService.getAllCustomer().subscribe((data: any) => {
  //       this.customers[index] = data.content[index];
  //       this.customerEditList[index][0] = this.customers[index];
  //
  //     }, error => {
  //       console.log(error);
  //     }, () => {
  //     }
  //   );
  // }

  // editMultiSubmit(): void {
  //   for (let i = 0; i < this.customerEditList.length; i++) {
  //     if (this.customerEditList[i][1]) {
  //       console.log(this.customerEditList[i][1]);
  //       if (this.uploadStatus[this.customerEditList[i][0].id]) {
  //         if (this.date[this.customerEditList[i][0].id] !== undefined) {
  //           this.editFormTest[i].patchValue({
  //             birthday: this.date[this.customerEditList[i][0].id],
  //           });
  //         }
  //         if (this.editUrl[this.customerEditList[i][0].id] !== undefined) {
  //           this.editFormTest[i].patchValue({
  //             imageUrl: this.editUrl[this.customerEditList[i][0].id],
  //           });
  //         }
  //         this.customerService.editCustomer(this.editFormTest[i].value).subscribe(
  //           next => {
  //             this.reloadEditTest(i);
  //             this.customerEditList[i][1] = false;
  //             this.edited[i] = true;
  //             // this.toastr.success('Thay đổi thành công thông tin của khách hàng  !');
  //           },
  //           error => console.log(error)
  //         );
  //       }
  //     }
  //   }
  //   this.toastr.success('Thay đổi thành công thông tin của khách hàng  !');
  // }

  // editMultiCheck(): boolean {
  //   for (let i = 0; i < this.customerEditList.length; i++) {
  //     if (this.customerEditList[i][1]) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  // editCancel(index) {
  //   this.customerEditList[index][1] = false;
  // }
  //
  // editMultiCancel() {
  //   this.ngOnInit();
  // }
  // user: Customer;


  searchName(): void {
    if (this.search === '') {
      this.hasSearch = false;
      this.ngOnInit();
    } else {
      this.hasSearch = true;
      this.onSubmit(0);
    }
  }

  onFirst(): void {
    this.pageClicked = 0;
    this.onSubmit(this.pageClicked);
  }

  onPrevious(): void {
    if (this.pageClicked > 0) {
      this.pageClicked--;
      this.onSubmit(this.pageClicked);
    }
  }

  onLast(): void {
    this.pageClicked = this.totalPages - 1;
    this.onSubmit(this.pageClicked);
  }

  onNext(): void {
    if (this.pageClicked < this.totalPages - 1) {
      this.pageClicked++;
      this.onSubmit(this.pageClicked);
    }
  }

  checkBirthDay(a: FormControl): { invalid: boolean } {
    const v = a.value;
    // console.log(v);
    const birthday: Date = new Date(v);
    const now: Date = new Date();
    // console.log(now);
    const day = birthday.getDay();
    // console.log(day);
    const month = birthday.getMonth();
    const year = birthday.getFullYear();
    const age = now.getFullYear() - year;
    // tslint:disable-next-line:prefer-const
    let ok: boolean;
    if (age < 18) {
      ok = false;
    } else if (age === 18) {
      if (now.getMonth() === month) {
        if (now.getDay() < day) {
          ok = false;
        }
      } else {
        ok = now.getMonth() >= month;
      }
    } else {
      ok = true;
    }
    return ok ? null : {invalid: true};
  }

  backToSearch(): void {
    this.search = '';
    this.hasSearch = false;
    this.onSubmit(0);
  }


  onDateSelect($event: NgbDate): void {
  }

  addCheckModal(): void {

  }

  leaveUploadPic_(): void {


  }
}
