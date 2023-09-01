import { ConsoleMonitor } from "./console-monitor";
import { CHANNEL_NAME, INIT_ENTITIES_DELAY } from "./constants";
import { Editor } from "./editor";
import { ServerScriptStatusMonitor } from "./status-monitor";

export class EditorServer {

  private entityId: Uuid;
  private remotelyCallable: string[];
  private client: any;
  private editor: Editor;
  private channelName = CHANNEL_NAME;

  constructor() {
    this.remotelyCallable = [
      'initialize',
      'update',
      'save',
      'load',
      'runScript',
      'stopScript'
    ];
  }

  public preload(entityId: Uuid) {
    this.entityId = entityId;
    this.channelName = CHANNEL_NAME.replace('{id}', entityId);

    Script.setTimeout(() => {
      var userData = Editor.parseUserData(entityId);
      this.editor = new Editor(userData);
      this.load(entityId, [undefined]);
    }, INIT_ENTITIES_DELAY);
  }

  public unload() { }

  public initialize(_id: Uuid, params: string[]) {
    const clientId = params[0];
    const content = this.editor.content;
    const fileName = this.editor.fileName;
    this.sendToClient(clientId, { type: 'SET_STATE', content, fileName, status: 'UNLOADED' });
  }

  public update(_id: Uuid, params: string[]) {
    let action: any;
    try {
      action = JSON.parse(params[1]);
    } catch (e) {
      return;
    }
    if (this.editor.applyUpdate(action)) {
      this.sendToAll(action);
    }
  }

  public save(_id: Uuid, params: string[]) {
    const clientId = params[0];
    const gameState = this.editor.saveFile(error => {
      if (error) {
        this.sendToClient(clientId, { type: 'SHOW_MESSAGE', message: 'Error: ' + error });
        return;
      }
      this.sendToClient(clientId, { type: 'SHOW_MESSAGE', message: 'File saved' });
    });
  }

  public load(_id: Uuid, params: string[]) {
    const clientId = params[0];

    this.editor.loadFile((content, fileName) => {
      if (!clientId) {
        return;
      }
      this.sendToAll({ type: 'SET_STATE', content, fileName });
      this.sendToClient(clientId, { type: 'SHOW_MESSAGE', message: 'File loaded' });
    });
  }

  public runScript(_id: Uuid, params: string[]) {
    const clientId = params[0];
    this.editor.saveFile((error) => {
      if (!error) {
        this.editor.runScript();
      }
    });
  }

  public stopScript(_id: Uuid, params: string[]) {
    this.editor.stopScript();
  }

  private callClient(clientId: Uuid, methodName: string, params: string[]) {
    if (this.client) {
      this.client[methodName](this.entityId, params);
      return;
    }
    Entities.callEntityClientMethod(clientId, this.entityId, methodName, params);
  }

  private sendToClient(clientId: Uuid, action: any) {
    this.callClient(clientId, 'emitWebEvent', [JSON.stringify(action)]);
  }

  private sendToAll(action: any) {
    Messages.sendMessage(this.channelName, JSON.stringify(action));
  }

}

export default new EditorServer();
