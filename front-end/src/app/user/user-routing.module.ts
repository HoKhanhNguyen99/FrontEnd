import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {TestComponent} from './test/test.component';
import {UserComponent} from './user.component';
import {UserManageComponent} from './user-manage/user-manage.component';
import {UserOdersComponent} from './user-oders/user-oders.component';
import {UserOderDetailComponent} from './user-oder-detail/user-oder-detail.component';
import {UserDetailComponent} from './user-detail/user-detail.component';
import {HomeStoreComponent} from './home-store/home-store.component';
import {HomeCakeComponent} from './home-store/home-cake/home-cake.component';
import {HomeCandyComponent} from './home-store/home-candy/home-candy.component';
import {DetailComponent} from './home-store/detail/detail.component';
import {OrderButtonComponent} from './orderButton/orderButton.component';
import {UserLoginComponent} from './user-login/user-login.component';
import {OrderFolowComponent} from './order-folow/order-folow.component';
import {HomeBakeryComponent} from './home-store/home-bakery/home-bakery.component';
import {AuthGuard} from '../auth/auth.guard';
import {RegisterSuccessComponent} from './register-success/register-success.component';
import {ShoppingCardComponent} from './shopping-card/shopping-card.component';
import {ShippingComponent} from './shipping/shipping.component';
import {PaymentComponent} from './payment/payment.component';
import {PaymentSuccessComponent} from './payment-success/payment-success.component';

const routes: Routes = [{
  path: '', component: UserComponent,
  children: [
    {path: 'test', component: TestComponent},
    {path: 'login', component: UserLoginComponent},
    {
      path: 'user-manage',
      component: UserManageComponent, canActivate: [AuthGuard],
      children: [
        {
          path: 'user-detail',
          component: UserDetailComponent,
        },
        {
          path: 'user-order',
          component: UserOdersComponent
        },
        {
          path: 'order-detail/:idOrder',
          component: UserOderDetailComponent
        },
        {
          path: 'order-follow/:idOrder',
          component: OrderFolowComponent
        }
      ]
    },
    {
      path: 'checkout/card',
      component: ShoppingCardComponent
    },
    {
      path: 'checkout/shipping',
      component: ShippingComponent
    },
    {
      path: 'checkout/payment',
      component: PaymentComponent
    },
    {
      path: 'checkout/payment-success',
      component: PaymentSuccessComponent
    }
  ],
},
  {
    path: 'home', component: UserComponent,
  },
  {
    path: 'register-success', component: RegisterSuccessComponent,
  },
  {
    path: '', component: UserComponent,
    children: [
      {path: '', component: OrderButtonComponent}
      ,
      {
        path: 'home-store', component: HomeStoreComponent, children: [
          {path: 'products/:id', component: DetailComponent},
          {path: 'home-bakery', component: HomeBakeryComponent},
          {path: 'home-bakery1', component: HomeCakeComponent},
          {path: 'home-bakery2', component: HomeCandyComponent}
        ]
      },

    ],
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ]
})
export class UserRoutingModule {
}
