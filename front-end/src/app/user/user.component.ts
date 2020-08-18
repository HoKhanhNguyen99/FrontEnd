import {Component, OnInit} from '@angular/core';
// import * as $ from 'jquery';
import {AccountService} from '../services/account.service';
import {TokenStorageService} from '../auth/token-storage.service';
import {CustomerService} from '../services/customer.service';
import {OrderService} from '../services/order.service';
import {Router} from '@angular/router';
import {FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser} from 'angularx-social-login';
import {AdminService} from '../services/admin.service';
import {Account} from '../models/account';
import {AuthLoginInfo} from '../auth/login-info';
import {AuthJwtService} from '../auth/auth-jwt.service';
import {LoginStatusService} from '../auth/login-status.service';
import {Customer} from '../models/customer';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  userDisplayName = '';
  idUser: number;
  user: SocialUser;
  private loggedIn: boolean;
  userInfo: AuthLoginInfo;
  submitted = false;
  roles: string[] = [];
  isLoginFailed = false;
  isLoggedIn = false;
  userLogin = '';
  customer: Customer;

  constructor(private accountService: AccountService,
              private tokenStorage: TokenStorageService,
              private customerService: CustomerService,
              private orderService: OrderService,
              public router: Router,
              private socialAuthService: SocialAuthService,
              private adminService: AdminService,
              private auth: AuthJwtService,
              private loginStatusService: LoginStatusService,
  ) {
  }

  ngOnInit(): void {
    this.userDisplayName = sessionStorage.getItem('loggedUser');
    this.customerService.getCustomerByAccountName(this.userDisplayName).subscribe(next => {
      this.customer = next;
      this.orderService.chanceCustomer(this.customer);
      this.idUser = this.customer.id;
      this.orderService.chanceIdUser(this.idUser);
    });
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
  }

  // tslint:disable-next-line:typedef
  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        console.log(socialPlatform + ' sign in data : ', userData);
        // Now sign-in with userData
        // ...
        this.loginStatusService.changeState(true);
        // this.router.navigate(['../upload-image'], { relativeTo: this.route });
        const userInfo: Account = {
          // @ts-ignore
          accountId: userData.id,
          accountName: userData.firstName,
          accountPassword: '1111111',
          email: userData.email,
          userName: userData.name
        };
        // accountId: number;
        // accountName: string;
        // accountPassword: string | Int32Array;
        // deleteFlag: boolean;
        // role: Role;
        // reason: string;
        console.log(userInfo);
        this.adminService.createMemberAccount(userInfo).subscribe(
          data => {
            console.log(data);
            this.login(new AuthLoginInfo(userInfo.accountName, '111111'));
          },
          error => {
            console.log(error);
          }
        );
      }
    );
  }
  // tslint:disable-next-line:typedef
  public login(userInfo){
    this.auth.attemptAuth(userInfo).subscribe(
      data => {
        console.log('OK ', data);
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUsername(data.accountName);
        this.tokenStorage.saveAuthorities(data.authorities);
        this.userLogin = data.accountName;
        this.roles = this.tokenStorage.getAuthorities();
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.loginStatusService.changeState(true);
        console.log(this.loginStatusService.status);
        // this.router.navigate(['../home'], { relativeTo: this.route });
      },
      error => {
        console.log('Error ', error);
        this.isLoginFailed = true;
        this.isLoggedIn = false;
        this.loginStatusService.changeState(false);
      }
    );
  }

// tslint:disable-next-line:typedef
  signOut() {
    this.tokenStorage.signOut();
    this.socialAuthService.signOut();
    window.location.reload();
  }

  // signInWithFB(): void {
  //   this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  // }
  // signInWithGoogle(): void {
  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  // }
}
