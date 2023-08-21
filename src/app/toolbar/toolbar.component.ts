import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../shared/api/api.service';
import { Subscription } from 'rxjs';
import { SessionService } from '../shared/session/session.service';
import { AlertService } from '../shared/alert/alert.service';

@Component({
  selector: 'ovt-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {

  public disabled = true;
  public fileName = '';
  public showOpenInEntity = false;
  public showClose = false;
  private initializedSubscription?: Subscription;
  private fileNameSubscription?: Subscription;
  private showCloseSubscription?: Subscription;
  private showOpenInEntitySubscription?: Subscription;

  constructor(
    private alertService: AlertService,
    private apiService: ApiService,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    this.fileNameSubscription = this.sessionService.get(session => session.fileName)
      .subscribe(fileName => {
        this.fileName = fileName;
      });

    this.initializedSubscription = this.sessionService.get(session => session.initialized)
      .subscribe(initialized => {
        this.disabled = !initialized;
      });

    this.showCloseSubscription = this.sessionService.get(session => session.showClose)
      .subscribe(showClose => {
        this.showClose = showClose;
      });

    this.showOpenInEntitySubscription = this.sessionService.get(session => session.showOpenInEntity)
      .subscribe(showOpenInEntity => {
        this.showOpenInEntity = showOpenInEntity;
      });
  }

  ngOnDestroy() {
    if (this.fileNameSubscription) {
      this.fileNameSubscription.unsubscribe();
    }
    if (this.initializedSubscription) {
      this.initializedSubscription.unsubscribe();
    }
    if (this.showCloseSubscription) {
      this.showCloseSubscription.unsubscribe();
    }
    if (this.showOpenInEntitySubscription) {
      this.showOpenInEntitySubscription.unsubscribe();
    }
  }

  public save() {
    this.apiService.saveFile();
  }

  public run() {
    this.apiService.runScript();
  }
  
  public reload() {
    this.apiService.reloadFile();
  }

  public close() {
    this.alertService.alert(
      'Close the editor?',
      'Close',
      ['Close', 'Cancel']
    ).subscribe(option => {
      if (option === 0) {
        this.apiService.closeEditor();
      }
    });
  }

  public openInEntity() {
    this.alertService.alert(
      'Open the editor in a Web Entity? All unsaved changes will be lost.',
      'Web Entity',
      ['Continue', 'Cancel']
    ).subscribe(option => {
      if (option === 0) {
        this.apiService.openInEntity();
      }
    });
  }
}
