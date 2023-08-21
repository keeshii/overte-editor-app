
type EventFn = (message: string, scriptName: string) => void;
export type ConsoleFn = (type: string, message: string, scriptName?: string) => void;

export class ConsoleMonitor {

  private infoFn: EventFn;
  private warnFn: EventFn;
  private errorFn: EventFn;
  private exceptionFn: (error: any) => void;

  constructor(callbackFn: ConsoleFn) {

    this.infoFn = function (message, scriptName) {
      callbackFn('INFO', message, scriptName);
    };
    this.warnFn = function (message, scriptName) {
      callbackFn('WARNING', message, scriptName);
    };
    this.errorFn = function (message, scriptName) {
      callbackFn('ERROR', message, scriptName);
    };
    this.exceptionFn = function (error) {
      callbackFn('ERROR', JSON.stringify(error));
    };
  }

  public subscribe() {
    (Script as any).printedMessage.connect(this.infoFn);
    (Script as any).infoMessage.connect(this.infoFn);
    (Script as any).warningMessage.connect(this.warnFn);
    (Script as any).errorMessage.connect(this.errorFn);
    (Script as any).unhandledException.connect(this.exceptionFn);
  };

  public unsubscribe() {
    (Script as any).printedMessage.disconnect(this.infoFn);
    (Script as any).infoMessage.disconnect(this.infoFn);
    (Script as any).warningMessage.disconnect(this.warnFn);
    (Script as any).errorMessage.disconnect(this.errorFn);
    (Script as any).unhandledException.disconnect(this.exceptionFn);
  }

}
