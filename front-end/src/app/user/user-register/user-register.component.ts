import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Customer} from '../../models/customer';
import {CustomerService} from '../../services/customer.service';
import {MaterialModule} from '../../shares/material.module';
import {Account} from '../../models/account';
import {AccountService} from '../../services/account.service';
import {AdminService} from '../../services/admin.service';
import {AuthLoginInfo} from '../../auth/login-info';
import {AuthJwtService} from '../../auth/auth-jwt.service';
import {Role} from '../../models/role';

// tslint:disable-next-line:typedef
function comparePassword(c: AbstractControl) {
  const v = c.value;
  return (v.accountPassword === v.confirmPassword) ? null : {
    passwordnotmatch: true
  };
}


@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss'],
  providers: [MaterialModule, MatSnackBar]

})
export class UserRegisterComponent implements OnInit {
  constructor(private customerService: CustomerService,
              private auth: AuthJwtService,
              private adminService: AdminService,
              private fb: FormBuilder,
              private router: Router,
              public snackbar: MatSnackBar) {
  }

  hide = true;
  // tslint:disable-next-line:variable-name
  validation_messages = {
    userName: [
      {type: 'required', message: 'Yêu Cầu Nhập Họ Tên'},
      {type: 'minlength', message: 'Họ Tên Cần Có Ít Nhất 5 Ký Tự '},
      {type: 'maxlength', message: 'Họ Tên Không Dài Quá 50 Ký Tự'},
      {type: 'pattern', message: 'Xin Hãy Bỏ Khoảng Trống'}
    ],
    accountName: [
      {type: 'required', message: 'Yêu Cầu Nhập Tên Đăng Nhập'},
      {type: 'minlength', message: 'Tên Đăng Nhập Cần Có Ít Nhất 5 Ký Tự'},
      {type: 'maxlength', message: 'Tên Đăng Nhập  Không Dài Quá 25 Ký Tự'},
    ],
    birthday: [
      {type: 'required', message: 'Yêu Cầu Nhập Ngày Sinh '},
      // {type: 'min', message: 'Renting a house over 18 years old'},
      // {type: 'max', message: 'Under 70 years old for renting house'}
    ],
    gender: [
      {type: 'required', message: 'Hãy Chọn Giới Tính'},
    ],
    phoneNumber: [
      {type: 'required', message: ' Yêu Cầu Nhập Số Điện Thoại'},
      {type: 'pattern', message: 'Số Điện Thoại Không Đúng'}
    ],
    // address: [
    //   {type: 'required', message: 'Address is required'},
    // ],
    email: [
      {type: 'required', message: 'Yêu Cầu Nhập Email'},
      {type: 'pattern', message: 'Định Dạng Email Không Đúng'},
    ],
    password: [
      {type: 'required', message: 'Yêu Cầu Nhập Mật Khẩu'},
      {type: 'minlength', message: 'Mật khẩu Cần Có Ít Nhất 6 Ký Tự'},
      // {type: 'pattern', message: 'Mật Khẩu bao gồm 1 ký tự viết hoa, 1 ký tự viết thường, và 1 ký tự số'},
      // {type: 'comparePassword', message: 'Mật Khẩu không trùng nhau '}
    ],
    confirmPassword: [
      // {type: 'required', message: 'Yêu Cầu Nhập Lại Mật Khẩu'},
      // {type: 'minlength', message: 'Password must be at least 5 characters long'},
      // {type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number'},
      {type: 'comparePassword', message: 'Mật khẩu không trùng nhau '}
    ],
  };
  form: any = {};
  userInfo: Customer;
  accountInfo: Account;
  isRegister = false;
  isRegisterFailed = false;
  errorMessage = '';
  registerForm: FormGroup;

  ngOnInit(): void {
    this.createFormRegister();
  }

  // tslint:disable-next-line:typedef
  createFormRegister() {
    this.registerForm = this.fb.group({
      userName: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        Validators.pattern(/^\S+.*\S+$/)
      ])),
      accountName: new FormControl('', Validators.compose([
        Validators.maxLength(50),
        Validators.minLength(5),
        Validators.required
      ])),
      gender: new FormControl('', Validators.compose([])),
      address: new FormControl('', Validators.compose([])),
      phone: new FormControl('', Validators.compose([
        Validators.required,
        // Validators.pattern(/^\+84\d{9,10}$/)
        Validators.pattern('(090|091|\\(84\\)\\+90|\\(84\\)\\+91)[0-9]{7}')
      ])),
      // address: new FormControl('', Validators.compose([
      //   Validators.required,
      // ])),
      birthday: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[_a-z0-9]+(\\.[_a-z0-9]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)*(\\.[a-z]{2,4})$')
      ])),
      accountPassword: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
        // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),
      confirmPassword: new FormControl('', Validators.compose([
        // Validators.required
      ]))
    }, {validator: comparePassword});
  }

// tslint:disable-next-line:typedef
  onSubmitRegisters() {
    console.log(this.registerForm);
    if (this.registerForm.valid) {
      this.adminService.createMemberAccount(this.registerForm.value)
        .subscribe(data => {
            const login = 'Quay Lại';
            const snackbarRef = this.snackbar.open('Đăng Ký Thành Công!', login, {
              horizontalPosition: 'center',
            });
            snackbarRef.onAction().subscribe(() => {
              this.router.navigate(['/home']);
              window.location.reload();
            });
            console.log(data);
          // });
        },
        error => {
          this.errorMessage = error.error.message;
          console.log('aaaaaaaa', error);
          this.isRegisterFailed = true;
          const errorMessage = this.snackbar.open('Tên đăng nhập không đúng hoặc đã tồn tại', 'Hãy Đăng Ký Lại', {
            horizontalPosition: 'center',
          });
          console.log(errorMessage);
        }
      );
    }
  }
}
