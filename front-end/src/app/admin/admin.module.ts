import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {ListAccountComponent} from './list-account/list-account.component';
import {AccessTimesComponent} from './access-times/access-times.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgxPaginationModule} from 'ngx-pagination';
import {FusionChartsModule} from 'angular-fusioncharts';
import * as FusionCharts from 'fusioncharts';
import * as charts from 'fusioncharts/fusioncharts.charts';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MaterialModule} from '../shares/material.module';
import {MatCardModule} from '@angular/material/card';

import {ListEmployeeComponent} from './list-employee/list-employee.component';


FusionChartsModule.fcRoot(FusionCharts, charts, FusionTheme);

@NgModule({
  declarations: [ListAccountComponent, AccessTimesComponent, ListEmployeeComponent],
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    FusionChartsModule,
    FormsModule,
    MatInputModule,
    MatDatepickerModule,
    MaterialModule,
    MatCardModule,
  ]
})
export class AdminModule {
}
