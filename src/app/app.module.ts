import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { EditorComponent } from './editor/editor.component';
import { MaterialModule } from './shared/material.module';
import { SharedModule } from './shared/shared.module';
import { ConsoleModule } from './console/console.module';
import { FooterModule } from './footer/footer.module';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    EditorComponent,
  ],
  imports: [
    BrowserModule,
    ConsoleModule,
    FooterModule,
    MaterialModule,
    SharedModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
