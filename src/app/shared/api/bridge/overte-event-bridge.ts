import { Observable, Subject } from "rxjs";
import { Bridge, BridgeEvent } from "./bidge.interface";
import { Action } from "../../session/actions";
import { NgZone } from "@angular/core";

interface EventBridgeType {
  scriptEventReceived: {
    connect: (fn: (message: string) => void) => void
    disconnect: (fn: (message: string) => void) => void
  },
  emitWebEvent: (message: string) => void;
}

declare const EventBridge: EventBridgeType;

export class OverteEventBridge implements Bridge {

  public message$: Observable<Action>;

  private messageSubject = new Subject<Action>();
  private scriptEventReceivedFn: (message: string) => void;

  constructor(
    private ngZone: NgZone
  ) {
    this.message$ = this.messageSubject.asObservable();
    this.scriptEventReceivedFn = message => this.handleEventMessage(message);
    EventBridge.scriptEventReceived.connect(this.scriptEventReceivedFn);
  }

  private handleEventMessage(message: string) {
    let data: Action | undefined = undefined;
    try {
      data = JSON.parse(message.toString());
    } catch (err) {
      // ignore
    }
    if (data && data.type) {
      this.ngZone.run(() => this.messageSubject.next(data as Action));
    }
  }

  public sendAction(action: Action): void {
    const message = JSON.stringify(action);
    EventBridge.emitWebEvent(message);
  }

  public sendEvent(eventType: BridgeEvent): void {
    const message = JSON.stringify({ type: eventType });
    EventBridge.emitWebEvent(message);
  }

}
