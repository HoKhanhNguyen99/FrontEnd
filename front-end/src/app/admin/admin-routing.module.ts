import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from './admin.component';
import {ListAccountComponent} from './list-account/list-account.component';
import {AccessTimesComponent} from './access-times/access-times.component';
import {AuthGuard} from '../auth/auth.guard';
import {EmployeeDetailComponent} from '../employee/employee-manager/employee-detail/employee-detail.component';
import {ListEmployeeComponent} from './list-employee/list-employee.component';

const routes: Routes = [
  {
    path: 'admin', component: AdminComponent, canActivate: [AuthGuard],
    children: [
      {path: 'list-account', component: ListAccountComponent, canActivate: [AuthGuard]},
      {path: 'access-times', component: AccessTimesComponent},
      {path: 'list-employee', component: ListEmployeeComponent},
      {path: 'list-account/:accountName', component: ListAccountComponent},
      {path: 'employee-manager/detail', component: EmployeeDetailComponent},
    ]
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class AdminRoutingModule {
}
