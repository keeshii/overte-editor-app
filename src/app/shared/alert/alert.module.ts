import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AlertPopupComponent } from './alert-popup/alert-popup.component';
import { AlertService } from './alert.service';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  declarations: [
    AlertPopupComponent
  ],
  providers: [
    AlertService
  ]
})
export class AlertModule { }
