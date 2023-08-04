import { Observable, Subject, take } from "rxjs";
import { Bridge, BridgeEvent } from "./bidge.interface";
import { Action } from "../../session/actions";
import { environment } from "../../../../environments/environment";
import { NgZone } from "@angular/core";

export class WebsocketBridge implements Bridge {

  public message$: Observable<Action>;

  private messageSubject = new Subject<Action>();
  
  private socket: WebSocket;
  private openedSubject = new Subject<boolean>();
  private opened = false;

  constructor(private ngZone: NgZone) {
    this.message$ = this.messageSubject.asObservable();
    this.socket = new WebSocket(environment.websocketAddress);
    this.initSocket();
  }

  private initSocket(): void {
    this.socket.addEventListener("open", () => {
      this.opened = true;
      this.openedSubject.next(true);
      console.log('OPENED');
    });

    this.socket.addEventListener("close", () => {
      this.opened = false;
      this.openedSubject.next(false);
      console.log('CLOSED');
    });

    this.socket.addEventListener("message", (event) => {
      let data: any;
      try {
        data = JSON.parse(event.data);
      } catch (err) {
        // ignore
      }
      if (data && data.type) {
        this.ngZone.run(() => this.messageSubject.next(data));
      }
    });
  }

  public sendAction(action: Action): void {
    if (!this.opened) {
      return;
    }
    const message = JSON.stringify(action);
    this.socket.send(message);
  }

  public sendEvent(eventType: BridgeEvent): void {
    const message = JSON.stringify({ type: eventType });
    // event before connection completed, wait for connection
    if (!this.opened) {
      this.openedSubject.pipe(take(1)).subscribe(() => this.socket.send(message));
      return;
    }
    this.socket.send(message);
  }

}
