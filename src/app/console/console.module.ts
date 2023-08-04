import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsoleComponent } from './console.component';
import { ErrorEntryComponent } from './error-entry/error-entry.component';
import { LogEntryComponent } from './log-entry/log-entry.component';
import { MaterialModule } from '../shared/material.module';
import { SharedModule } from '../shared/shared.module';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { FilterLogsPipe } from './logs-filter.pipe';


@NgModule({
  declarations: [
    ConsoleComponent,
    ErrorEntryComponent,
    FilterLogsPipe,
    LogEntryComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxJsonViewerModule,
    SharedModule,
  ],
  exports: [
    ConsoleComponent
  ]
})
export class ConsoleModule { }
