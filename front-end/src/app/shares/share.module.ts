import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

const ShareModules = [
  ReactiveFormsModule,
  FormsModule,
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ShareModules,
  ],
  exports: [
    ShareModules,
  ]
})
export class ShareModule {
}
