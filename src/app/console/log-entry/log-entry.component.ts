import { Component, Input } from '@angular/core';
import { LogItem } from 'src/app/shared/session/session.interface';

@Component({
  selector: 'ovt-log-entry',
  templateUrl: './log-entry.component.html',
  styleUrls: ['./log-entry.component.scss']
})
export class LogEntryComponent {

  @Input()
  public info: LogItem;
  
  constructor() {
    this.info = { logType: 'INFO', items: [] };
  }

}
