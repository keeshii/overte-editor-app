import { EditorWindow } from "./editor-window";

(function () {
  var ENTITY_ID_PLACEHOLDER = '{00000000-0000-0000-0000-000000000000}';

  // Choose entity
  var entityId = Window.prompt('Enter the Entity UUID you want to edit', ENTITY_ID_PLACEHOLDER);
  if (!entityId) {
    return;
  }

  // Check if entity exists
  var properties = Entities.getEntityProperties(entityId, ['id', 'script', 'serverScripts', 'locked']);
  if (properties.id !== entityId) {
    Window.alert("Entity not found");
    return;
  }

  if (properties.locked) {
    Window.alert("Entity is locked. You must unlock it first.");
    return;
  }

  // Server or Client Script?
  var isClient = Window.confirm("Yes - client, No -server script");

  var editor = new EditorWindow(entityId, isClient);
  editor.openEditor();
}());
