import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionService } from '../shared/session/session.service';
import { LogItem, StatusType } from '../shared/session/session.interface';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'ovt-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  public disabled = true;
  public StatusType = StatusType;
  public status: StatusType;
  public badgeHidden = true;

  private statusSubscription?: Subscription;
  private logsSubscription?: Subscription;
  private initializedSubscription?: Subscription;

  constructor(
    private sessionService: SessionService
  ) {
    this.status = StatusType.UNLOADED;
  };

  ngOnInit() {
    this.statusSubscription = this.sessionService.get(session => session.status)
      .subscribe(status => {
        this.status = status;
      });
      
    this.logsSubscription = this.sessionService.get(session => session.logs)
      .subscribe((logs: LogItem[]) => {
        const errorCount = logs.filter(log => log.logType === 'ERROR').length;
        this.badgeHidden = errorCount === 0;
      });

    this.initializedSubscription = this.sessionService.get(session => session.initialized)
      .subscribe(initialized => {
        this.disabled = !initialized;
      });
  }

  ngOnDestroy() {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
    if (this.logsSubscription) {
      this.logsSubscription.unsubscribe();
    }
    if (this.initializedSubscription) {
      this.initializedSubscription.unsubscribe();
    }
  }

  public toggleConsole() {
    const consoleOpened = !this.sessionService.session.consoleOpened;
    this.sessionService.set({ consoleOpened });
  }

}
