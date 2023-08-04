export const environment = {
  /*
   * Which text editor should be used.
   * possible values: 'monaco', 'textarea'
   */
  editor: 'monaco',

  /*
   * How the editor should communicate:
   * possible values: 'websocket', 'eventbridge', 'mock'
   */
  bridge: 'eventbridge',

  /*
   * Websocket address to listen on.
   * Ignored if the bridge is not 'websocket'.
   */
  websocketAddress: 'ws://localhost:8080/editor',

  /*
   * The console will be cleared after clicking
   * the run button from the toolbar.
   */
  clearConsoleAfterRun: true,

  /*
   * Maximum number of items in the console.
   * If exceeded, the old logs will be removed.
   */
  maxConsoleLogs: 255
};
