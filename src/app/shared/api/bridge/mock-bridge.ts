import { Observable, Subject } from "rxjs";
import { Bridge, BridgeEvent } from "./bidge.interface";
import { Action, SetStateAction, SetFileNameAction, } from "../../session/actions";

export class MockBridge implements Bridge {

  public message$: Observable<Action>;

  private messageSubject = new Subject<Action>();

  constructor() {
    this.message$ = this.messageSubject.asObservable();
  }

  public sendAction(action: Action): void {
    return;
  }

  public sendEvent(eventType: BridgeEvent): void {
    if (eventType === BridgeEvent.INITIALIZE) {
      window.setTimeout(() => {
        const fileName = 'hello.txt';
        const content = 'Hello World';
        this.messageSubject.next(new SetFileNameAction(fileName));
        this.messageSubject.next(new SetStateAction(content));
      }, 500);
    }
  }

}
