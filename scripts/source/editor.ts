import { EditorUserData, UpdateAction } from './editor.interface';

export class Editor {

  public content: string;
  public fileName: string;
  private scriptType: 'client' | 'server';
  private editingEntityId: Uuid;

  constructor(params: EditorUserData) {
    this.fileName = params.fileName.replace(/^atp:\/+/, '');
    this.content = '';
    this.scriptType = params.scriptType;
    this.editingEntityId = params.editingEntityId;
  }

  static parseUserData(entityId: Uuid): EditorUserData {
    var properties = Entities.getEntityProperties(entityId, ['userData']);
    var userData;
    try {
      userData = JSON.parse(properties.userData);
    } catch (e) {
      return;
    }
    return {
      fileName: userData.fileName,
      scriptType: userData.scriptType,
      editingEntityId: userData.editingEntityId
    };
  };

  public applyUpdate(action: UpdateAction): boolean {
    let text = this.content;
    if (action.remove) {
      text = text.substring(0, action.position)
        + text.substring(action.position + action.remove);
    }

    if (action.insert) {
      text = text.substring(0, action.position)
        + String(action.insert)
        + text.substring(action.position);
    }

    if (text === this.content) {
      return false;
    }

    this.content = text;
    return true;
  }

  public saveFile(callback: (error: string) => void) {
    if (!this.fileName) {
      return;
    }
    var self = this;
    var content = this.content;
    var fileName = this.fileName;

    Assets.putAsset({
      data: String(content),
      path: '/' + fileName
    }, function (error: string) {
      callback(error);
    });
  };

  public loadFile(callback: (content: string | undefined, fileName: string) => void) {
    var self = this;
    Assets.getAsset({
      url: '/' + this.fileName,
      responseType: "text"
    }, function (error: Error, result: { response: string }) {
      if (error) {
        return;
      }
      self.content = result.response;
      callback(self.content, 'atp:/' + self.fileName);
    });
  };

  runScript() {
    var timestamp;
    switch (this.scriptType) {
      case 'client':
        timestamp = Date.now();
        Entities.editEntity(this.editingEntityId, { scriptTimestamp: timestamp } as any);
        break;
      case 'server':
        this.stopScript();
        break;
    }
  };

  stopScript() {
    Entities.reloadServerScripts(this.editingEntityId);
  };

}
