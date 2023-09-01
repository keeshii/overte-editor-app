import { ConsoleMonitor } from './console-monitor';
import { CHANNEL_NAME, INIT_ENTITIES_DELAY } from './constants';
import { Editor } from './editor';
import { Action } from './editor.interface';
import { ServerScriptStatusMonitor } from './status-monitor';

export class EditorClient {

  private webEventReceivedFn: (id: Uuid, message: string) => void;
  private messageReceivedFn: (channel: string, message: string, senderId: Uuid, localOnly: boolean) => void;
  private entityId: Uuid;
  private channelName = 'OVERTE_EDITOR_CHANNEL_{id}';
  private remotelyCallable: string[];
  private statusMonitor: ServerScriptStatusMonitor;
  private consoleMonitor: ConsoleMonitor;

  constructor() {
    this.initializeCallbacks();
    
    this.remotelyCallable = [
      'emitWebEvent'
    ];
  };

  private initializeCallbacks() {
    this.webEventReceivedFn = (id: Uuid, message: string) => {
      this.onWebEventReceived(id, message);
    };
    this.messageReceivedFn = (channel: string, message: string, senderId: Uuid, localOnly: boolean) => {
      this.onMessageReceived(channel, message, senderId, localOnly);
    };
  };

  public preload(entityId: Uuid) {
    this.entityId = entityId;
    this.channelName = CHANNEL_NAME.replace('{id}', entityId);

    Entities.webEventReceived.connect(this.webEventReceivedFn);
    Messages.subscribe(this.channelName);
    Messages.messageReceived.connect(this.messageReceivedFn);

    Script.setTimeout(() => {
      var userData = Editor.parseUserData(entityId);
      this.statusMonitor = new ServerScriptStatusMonitor(userData.editingEntityId, (status: any) => {
        this.updateScriptStatus(status);
      });
      this.consoleMonitor = new ConsoleMonitor((type, message, scriptName) => {
        this.appendLog(type, message, scriptName);
      });
      this.consoleMonitor.subscribe();
    }, INIT_ENTITIES_DELAY);
  }

  public unload() {
    Entities.webEventReceived.disconnect(this.webEventReceivedFn);
    Messages.unsubscribe(this.channelName);
    Messages.messageReceived.disconnect(this.messageReceivedFn);
    if (this.statusMonitor) {
      this.statusMonitor.stop();
    }
    if (this.consoleMonitor) {
      this.consoleMonitor.unsubscribe();
    }
  }

  public emitWebEvent(_id: string, params: string[]) {
    const message = params[0];
    Entities.emitScriptEvent(this.entityId, message);
  }

  private onWebEventReceived(id: Uuid, message: string) {
    let action: Action;

    if (id !== this.entityId) {
      return;
    }

    try {
      action = JSON.parse(message);
    } catch (e) {
      return;
    }

    switch (action.type) {
      case 'INITIALIZE':
        this.emitToWebView({ type: 'SET_TOOLBAR_BUTTONS', showClose: true, showOpenInEntity: false });
        this.callServer('initialize');
        break;
      case 'UPDATE':
        this.callServer('update', [JSON.stringify(action)]);
        break;
      case 'SET_SCROLL':
        this.sendToAll(action);
        break;
      case 'SAVE':
        this.callServer('save');
        break;
      case 'RELOAD':
        this.callServer('load');
        break;
      case 'RUN':
        this.callServer('runScript');
        break;
      case 'STOP':
        this.callServer('stopScript');
        break;
      case 'CLOSE':
        Entities.deleteEntity(this.entityId);
        break;
    }
  }

  private onMessageReceived(channel: string, message: string, senderId: Uuid, localOnly: boolean) {
    if (channel !== this.channelName) {
      return;
    }
    Entities.emitScriptEvent(this.entityId, message);
  };

  private sendToAll(action: any) {
    Messages.sendMessage(this.channelName, JSON.stringify(action));
  }

  private callServer(method: string, params: string[] = []) {
    params.unshift(MyAvatar.sessionUUID);
    Entities.callEntityServerMethod(this.entityId, method, params);
  }

  private emitToWebView(action: any) {
    const message = JSON.stringify(action);
    Entities.emitScriptEvent(this.entityId, message);
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

export default new EditorClient();
