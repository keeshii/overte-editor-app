import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertModule } from './alert/alert.module';
import { FormsModule } from '@angular/forms';
import { MonacoEditorComponent } from './monaco-editor/monaco-editor.component';
import { TextareaEditorComponent } from './textarea-editor/textarea-editor.component';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { ScrollWhenDirective } from './scroll-when/scroll-when.directive';


@NgModule({
  declarations: [
    MonacoEditorComponent,
    ScrollWhenDirective,
    TextareaEditorComponent
  ],
  imports: [
    AlertModule,
    CommonModule,
    FormsModule,
    MonacoEditorModule.forRoot(),
  ],
  exports: [
    AlertModule,
    MonacoEditorComponent,
    ScrollWhenDirective,
    TextareaEditorComponent
  ]
})
export class SharedModule { }
