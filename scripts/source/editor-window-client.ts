import { Action } from './action.interface';
import { ConsoleMonitor } from './console-monitor';
import { Editor } from './editor';
import { EditorUserData } from './editor.interface';
import { ServerScriptStatusMonitor } from './status-monitor';

export class EditorWindowClient {

  private editor: Editor;
  private webEventReceivedFn: any;
  private statusMonitor: ServerScriptStatusMonitor;
  private consoleMonitor: ConsoleMonitor;

  constructor(
    private window: OverlayWebWindow,
    private userData: EditorUserData
  ) {}

  public preload() {
    this.editor = new Editor(this.userData);
    this.webEventReceivedFn = (message: string) => this.onWebEventReceived(message)
    this.window.webEventReceived.connect(this.webEventReceivedFn);

    this.statusMonitor = new ServerScriptStatusMonitor(this.userData.editingEntityId, (status: any) => {
      this.updateScriptStatus(status);
    });

    this.consoleMonitor = new ConsoleMonitor((type, message, scriptName) => {
      this.appendLog(type, message, scriptName);
    });
    this.consoleMonitor.subscribe();
  }

  public unload() {
    this.window.webEventReceived.disconnect(this.webEventReceivedFn);
    this.statusMonitor.stop();
    this.consoleMonitor.unsubscribe();
  }

  private onWebEventReceived(message: string) {
    let action: Action;
    try {
      action = JSON.parse(message);
    } catch (e) {
      return;
    }

    switch (action.type) {
      case 'INITIALIZE':
        this.emitToWebView({ type: 'SET_TOOLBAR_BUTTONS', showClose: false, showOpenInEntity: true });
        this.editor.loadFile((content, fileName) => {
          this.emitToWebView({ type: 'SET_STATE', content, fileName });
        });
        break;
      case 'UPDATE':
        this.editor.applyUpdate(action as any);
        this.emitToWebView(action);
        break;
      case 'SET_SCROLL':
        break;
      case 'SAVE':
        this.editor.saveFile(error => {
          if (error) {
            this.emitToWebView({ type: 'SHOW_MESSAGE', message: 'Error: ' + error });
            return;
          }
          this.emitToWebView({ type: 'SHOW_MESSAGE', message: 'File saved' });
        });
        break;
      case 'RELOAD':
        this.editor.loadFile((content, fileName) => {
          this.emitToWebView({ type: 'SET_STATE', content, fileName });
          this.emitToWebView({ type: 'SHOW_MESSAGE', message: 'File loaded' });
        });
        break;
      case 'RUN':
        this.editor.saveFile((error) => {
          if (!error) {
            this.editor.runScript();
          }
        });
        break;
      case 'STOP':
        this.editor.stopScript();
        break;
      case 'OPEN_IN_ENTITY':
        (this.window as any).close();
        break;
    }
  }

  private emitToWebView(action: any) {
    const message = JSON.stringify(action);
    this.window.emitScriptEvent(message);
  }

  private updateScriptStatus = function(status: any) {
    if (status.isRunning && status.status === 'running') {
      this.emitToWebView({ type: 'SET_STATUS', status: 'RUNNING' });
      this.wasRunning = true;
      return;
    }

    if (status.status === 'error_running_script' && this.wasRunning) {
      this.emitToWebView({ type: 'LOG_ERROR', error: status.errorInfo });
      this.emitToWebView({ type: 'SET_STATUS', status: 'UNLOADED' });
      this.wasRunning = false;
    }
  };

  private appendLog(severity: string, message: string, scriptName: string) {
    if (severity === 'ERROR') {
      this.emitToWebView({ type: 'LOG_ERROR', error: message });
      return;
    }
    this.emitToWebView({ type: 'LOG_INFO', items: [message] });
  };

}

