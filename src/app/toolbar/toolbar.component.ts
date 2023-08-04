import { Component, Input } from '@angular/core';
import { ApiService } from '../shared/api/api.service';
import { Subscription } from 'rxjs';
import { SessionService } from '../shared/session/session.service';
import { AlertService } from '../shared/alert/alert.service';

@Component({
  selector: 'ovt-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  public disabled = true;
  public fileName = '';
  private initializedSubscription?: Subscription;
  private fileNameSubscription?: Subscription;

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
  }

  ngOnDestroy() {
    if (this.fileNameSubscription) {
      this.fileNameSubscription.unsubscribe();
    }
    if (this.initializedSubscription) {
      this.initializedSubscription.unsubscribe();
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
}
