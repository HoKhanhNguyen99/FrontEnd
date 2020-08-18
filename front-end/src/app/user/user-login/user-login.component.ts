import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthLoginInfo} from '../../auth/login-info';
import {TokenStorageService} from '../../auth/token-storage.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthJwtService} from '../../auth/auth-jwt.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  userInfo: AuthLoginInfo;
  message = '';
  constructor(private auth: AuthJwtService, private fb: FormBuilder,
              private tokenStorage: TokenStorageService,
              private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  // tslint:disable-next-line:typedef
  onSubmit() {
    console.log('a');
    this.submitted = true;
    this.userInfo = new AuthLoginInfo(this.fusername.value, this.fpassword.value);
    console.log(this.userInfo);
    this.login(this.userInfo);
  }
  // tslint:disable-next-line:typedef
  // $('#loginButton').onSubmit(function() {
  //   $('#loginButton').modal('hide');
  // });
  // tslint:disable-next-line:typedef
  get fusername() {
    return this.loginForm.get('username');
  }

  // tslint:disable-next-line:typedef
  get fpassword() {
    return this.loginForm.get('password');
  }

  // tslint:disable-next-line:typedef
  public login(userInfo) {
    console.log(userInfo);
    this.auth.attemptAuth(userInfo).subscribe(
      data => {
        this.tokenStorage.saveAuthorities(data.authorities);
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUsername(data.accountName);
        sessionStorage.setItem('loggedUser', userInfo.accountName);
        console.log('data', this.tokenStorage.saveUsername(data.accountName));
        console.log('data', data);
        sessionStorage.setItem('loggedUser', userInfo.accountName);
        $('.modal-backdrop').remove();
        // sessionStorage.setItem('idUser', data.id);
        // tslint:disable-next-line:triple-equals
        if (this.tokenStorage.getAuthorities().indexOf('ROLE_ADMIN') != -1) {
          // this.router.navigateByUrl("/")
          this.redirectTo('admin');
          // tslint:disable-next-line:triple-equals
        } else if (this.tokenStorage.getAuthorities().indexOf('ROLE_EMPLOYEE') != -1) {
          this.redirectTo('employee/employee');
          // tslint:disable-next-line:triple-equals
        } else if (this.tokenStorage.getAuthorities().indexOf('ROLE_WAREHOUSE') != -1) {
          this.redirectTo('employee/warehouse-management');
        }
        // tslint:disable-next-line:triple-equals
        else if (this.tokenStorage.getAuthorities().indexOf('ROLE_PARTNER') != -1) {
          this.redirectTo('employee/partner-management');
        }
        // tslint:disable-next-line:triple-equals
        else if (this.tokenStorage.getAuthorities().indexOf('ROLE_MEMBER') != -1) {

          // sessionStorage.setItem('loggedUser', userInfo.accountName);
          this.redirectTo('');
          // window.location.reload();
          // this.tokenStorage.getUsername();
        }
        console.log('data1', this.tokenStorage.getAuthorities());
        console.log('data', userInfo.accountName);

      },
      error => {
        console.log('Error ', error);
        this.message = 'Tên đăng nhập không tồn tại hoặc sai mật khẩu';
      }
    );
  }

  // tslint:disable-next-line:typedef
  redirectTo(uri: string) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate([uri]));
  }

}
