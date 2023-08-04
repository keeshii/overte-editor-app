import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'ovt-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {

  public editor: string;

  @Input()
  public disabled = true;

  constructor() {
    this.editor = environment.editor;
  }

}
