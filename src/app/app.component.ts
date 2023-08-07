import { Component, OnDestroy, OnInit } from '@angular/core';

import { ApiService } from './shared/api/api.service';
import { AlertService } from './shared/alert/alert.service';
import { Observable, Subscription, catchError, filter, map, of, take, timeout } from 'rxjs';
import {
  ActionType, LogErrorAction, LogInfoAction, SetStateAction, SetFileNameAction,
  ShowMessageAction, SetScrollAction, SetStatusAction, UpdateAction
} from './shared/session/actions';
import { SessionService } from './shared/session/session.service';
import { EditorService } from './shared/session/editor.service';
import { LogItem, Session } from './shared/session/session.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ovt-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {

  public initialized = false;
  public loading = false;
  public consoleOpened: boolean;
  private messageSubscription?: Subscription;
  private consoleSubscription?: Subscription;

  constructor(
    private alertService: AlertService,
    private apiService: ApiService,
    private editorService: EditorService,
    private sessionService: SessionService
  ) {
    this.consoleOpened = sessionService.session.consoleOpened;
  }

  public ngOnInit() {
    this.messageSubscription = this.apiService.message$
      .subscribe(action => {
        if (action.type === ActionType.SET_STATE) {
          const setContentAction = action as SetStateAction;
          const sessionUpdate: Partial<Session> = { editorContent: setContentAction.content };
          if (setContentAction.fileName !== undefined) {
            sessionUpdate.fileName = setContentAction.fileName;
          }
          if (setContentAction.status !== undefined) {
            sessionUpdate.status = setContentAction.status;
          }
          this.sessionService.set(sessionUpdate);
          this.editorService.clearError();
        }
        if (action.type === ActionType.SHOW_MESSAGE) {
          const showMessageAction = action as ShowMessageAction;
          this.alertService.toast(showMessageAction.message);
        }
        if (action.type === ActionType.SET_FILE_NAME) {
          const setFileNameAction = action as SetFileNameAction;
          this.sessionService.set({ fileName: setFileNameAction.fileName });
        }
        if (action.type === ActionType.UPDATE) {
          const updateAction = action as UpdateAction;
          const prevContent = this.sessionService.session.editorContent;
          const editorContent = this.editorService.applyUpdate(prevContent, updateAction);
          this.sessionService.set({ editorContent });
        }
        if (action.type === ActionType.SET_SCROLL) {
          const setScrollAction = action as SetScrollAction;
          this.sessionService.set({ scroll: { top: setScrollAction.top, left: setScrollAction.left } });
        }
        if (action.type === ActionType.SET_STATUS) {
          const setStatusAction = action as SetStatusAction;
          this.sessionService.set({ status: setStatusAction.status });
        }
        if (action.type === ActionType.LOG_ERROR) {
          const logErrorAction = action as LogErrorAction;
          this.appendLogItem({
            logType: 'ERROR',
            items: [logErrorAction.error],
            line: logErrorAction.line,
            col: logErrorAction.col
          });
        }
        if (action.type === ActionType.LOG_INFO) {
          const logInfoAction = action as LogInfoAction;
          this.appendLogItem({
            logType: 'INFO',
            items: logInfoAction.items
          });
        }
      });

    this.consoleSubscription = this.sessionService.get(session => session.consoleOpened)
      .subscribe(consoleOpened => {
        this.consoleOpened = consoleOpened;
      });

    this.refreshState();
  }

  public ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    if (this.consoleSubscription) {
      this.consoleSubscription.unsubscribe();
    }
  }

  public refreshState() {
    this.loading = true;
    this.initializeWithTimeout()
      .subscribe(initialized => {
        this.loading = false;

        if (initialized) {
          this.initialized = initialized;
          this.sessionService.set({ initialized });
          return;
        }

        this.alertService.alert(
          'Unable to initialize the editor.',
          'Error',
          ['Try Again', 'Close']
        ).subscribe(option => {
          console.log(option);
          if (option === 0) {
            this.refreshState();
          } else {
            this.apiService.closeEditor();
          }
        });
      });
  }

  private initializeWithTimeout(): Observable<boolean> {
    const observable = this.apiService.message$.pipe(
      filter(action => action.type === ActionType.SET_STATE),
      map(() => true),
      timeout(5000),
      catchError(() => of(false)),
      take(1)
    );
    this.apiService.initialize();
    return observable;
  }

  private appendLogItem(logItem: LogItem) {
    const maxLength = environment.maxConsoleLogs - 1;
    const logs = this.sessionService.session.logs.slice(-maxLength);
    logs.push(logItem);
    this.sessionService.set({ logs });
  }

}
