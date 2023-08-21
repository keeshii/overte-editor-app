import { EditorWindowClient } from "./editor-window-client";
import { EditorUserData } from "./editor.interface";

const EDITOR_SOURCE_URL = 'https://keeshii.github.io/overte-editor-app/';
const EDITOR_WIDTH = 1.92;
const EDITOR_HEIGHT = 1.08;

export class EditorWindow {

  private entityId: Uuid;
  private isClient: boolean;

  constructor(entityId: Uuid, isClient: boolean) {
    this.entityId = entityId;
    this.isClient = isClient;
  }

  public openEditor() {

    if (!Entities.canWriteAssets()) {
      Window.alert("You have no permission to make changes to the asset server's assets");
      return;
    }

    const entityId = this.entityId;
    const isClient = this.isClient;

    const properties = Entities.getEntityProperties(entityId, ['id', 'script', 'serverScripts', 'locked']);
    if (properties.id !== entityId) {
      Window.alert("Entity not found");
      return;
    }
    if (properties.locked) {
      Window.alert("Entity is locked. You must unlock it first.");
      return;
    }

    // Server or Client Script?
    const scriptUrl = isClient ? properties.script : properties.serverScripts;

    // Ensure script is in the Asset Server
    // then spawn editor
    this.prepareScriptToEdit(scriptUrl, function(fileName) {
      var userData: EditorUserData = {
        fileName: fileName,
        scriptType: isClient ? 'client' : 'server',
        editingEntityId: entityId,
        grabbableKey: {grabbable: false, triggerable: false}
      };

      var translation = Vec3.multiplyQbyV(MyAvatar.orientation, { x: 0, y: 0.5, z: -3 });
      var position = Vec3.sum(MyAvatar.position, translation);

      var overlayWebWindow = new OverlayWebWindow({
          title: "Script Editor",
          source: EDITOR_SOURCE_URL,
          width: EDITOR_WIDTH * 400,
          height: EDITOR_HEIGHT * 400
      });

      const client = new EditorWindowClient(overlayWebWindow, userData);
      client.preload();

      const onClosed = () => {
        overlayWebWindow.closed.disconnect(onClosed);
        client.unload();
      };

      overlayWebWindow.closed.connect(onClosed);
    });

  }

  private downloadFileFromUrl(url: string) {
    var request = new XMLHttpRequest();
    (request as any).open('GET', url, false);  // `false` makes the request synchronous
    (request as any).send(null);
    if (request.status === 0 || request.status === 200) {
      return request.responseText;
    }
    return undefined;
  }

  private getFileNameFromUrl(url: string) {
    var name = url.replace(/.*\//, '');
    if (name === '') {
      name = 'file.js';
    }
    if (!name.endsWith('.js')) {
      name += '.js';
    }
    return name;
  }

  private prepareScriptToEdit(url: string, callback: (fileName: string) => void) {
    var fileName = 'file.js';

    // Script already in the Asset Server, just remember its name
    if (url.match(/^atp:\//)) {
      fileName = url.replace('atp:/', '');
      callback(fileName);
      return;
    }

    // Script will be copied to the Asset Server
    var proceed = Window.confirm("The script will be copied to the Asset Server and may overwrite some other files. Say YES if you want to proceed.");
    if (!proceed) {
      return;
    }

    var content = url || ' ';
    if (url.match(/(file|https?):\/\//)) {
      fileName = this.getFileNameFromUrl(url);

      content = this.downloadFileFromUrl(url);
      if (content === undefined) {
        Window.alert("Unable to download the file.");
        return;
      }
    }

    Assets.putAsset({ data: String(content), path: '/' + fileName }, function (error: string) {
      if (error) {
        Window.alert("Cannot save file to Asset Server");
        return;
      }
      Entities.editEntity(this.entityId, this.isClient
        ? { script: 'atp:/' + fileName }
        : { serverScripts: 'atp:/' + fileName } as any);
      callback(fileName);
    });
  }

}
