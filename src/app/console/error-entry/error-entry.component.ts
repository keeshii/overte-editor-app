import { Component, Input } from '@angular/core';
import { EditorService } from '../../shared/session/editor.service';
import { LogItem } from '../../shared/session/session.interface';

@Component({
  selector: 'ovt-error-entry',
  templateUrl: './error-entry.component.html',
  styleUrls: ['./error-entry.component.scss']
})
export class ErrorEntryComponent {

  @Input()
  public error: LogItem;

  constructor(
    private editorService: EditorService
  ) {
    this.error = { logType: 'ERROR', items: [] };
  }

  public goToError() {
    const line = this.error.line;
    const col = this.error.col;
    if (line === undefined || col === undefined) {
      return;
    }
    this.editorService.goToLine(line, col);
  }

}
