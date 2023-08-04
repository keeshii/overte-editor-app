import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionService } from '../shared/session/session.service';
import { LogItem } from '../shared/session/session.interface';
import { EditorService } from '../shared/session/editor.service';

@Component({
  selector: 'ovt-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {

  private logsSubscription?: Subscription;
  private consoleSubscription?: Subscription;
  public logs: LogItem[] = [];

  public consoleOpened = false;
  public autoScroll = true;
  public showInfos = true;
  public showErrors = true;
  public errorCount = 0;
  public infoCount = 0;
  public lastLog?: LogItem;

  constructor(
    private sessionService: SessionService,
    private editorService: EditorService
  ) {
  }

  public ngOnInit() {
    this.logsSubscription = this.sessionService.get(session => session.logs)
      .subscribe((logs: LogItem[]) => {
        this.logs = logs;
        this.errorCount = logs.filter(log => log.logType === 'ERROR').length;
        this.infoCount = logs.filter(log => log.logType === 'INFO').length;
        this.lastLog = this.logs.length ? this.logs[this.logs.length - 1] : undefined;
        this.editorService.showError(this.lastLog);
      });

    this.consoleSubscription = this.sessionService.get(session => session.consoleOpened)
      .subscribe(consoleOpened => {
        this.consoleOpened = consoleOpened;
      });
  }

  public ngOnDestroy() {
    if (this.logsSubscription) {
      this.logsSubscription.unsubscribe();
    }
    if (this.consoleSubscription) {
      this.consoleSubscription.unsubscribe();
    }
  }

  public toggleAutoScroll(checked: boolean) {
    this.autoScroll = checked;
  }

  public clearLogs() {
    this.sessionService.set({ logs: [] });
  }

  public toggleInfo() {
    this.showInfos = !this.showInfos;
  }

  public toggleError() {
    this.showErrors = !this.showErrors;
  }

  public closeConsole() {
    this.sessionService.set({ consoleOpened: false });
  }

}
