import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';
import { MaterialModule } from '../shared/material.module';
import { SharedModule } from '../shared/shared.module';
import { StatusInfoComponent } from './status-info/status-info.component';


@NgModule({
  declarations: [
    FooterComponent,
    StatusInfoComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
  ],
  exports: [
    FooterComponent  
  ]
})
export class FooterModule { }
