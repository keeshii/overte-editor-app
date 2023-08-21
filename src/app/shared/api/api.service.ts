import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { Bridge, BridgeEvent } from './bridge/bidge.interface';
import { MockBridge } from './bridge/mock-bridge';
import { Action } from '../session/actions';
import { WebsocketBridge } from './bridge/websocket-bridge';
import { OverteEventBridge } from './bridge/overte-event-bridge';
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public message$: Observable<Action>;
  private bridge: Bridge;

  constructor(
    private ngZone: NgZone
  ) {

    switch (environment.bridge) {
      case 'websocket':
        this.bridge = new WebsocketBridge(ngZone);
        break;
      case 'eventbridge':
        this.bridge = new OverteEventBridge(ngZone);
        break;
      default:
        this.bridge = new MockBridge();
    }

    this.message$ = this.bridge.message$;
  }

  public initialize(): void {
    this.bridge.sendEvent(BridgeEvent.INITIALIZE);
  }

  public saveFile(): void {
    this.bridge.sendEvent(BridgeEvent.SAVE);
  }

  public reloadFile(): void {
    this.bridge.sendEvent(BridgeEvent.RELOAD);
  }

  public runScript(): void {
    this.bridge.sendEvent(BridgeEvent.RUN);
  }

  public stopScript(): void {
    this.bridge.sendEvent(BridgeEvent.STOP);
  }

  public closeEditor(): void {
    this.bridge.sendEvent(BridgeEvent.CLOSE);
  }

  public openInEntity(): void {
    this.bridge.sendEvent(BridgeEvent.OPEN_IN_ENTITY);
  }

  public sendAction(action: Action) {
    this.bridge.sendAction(action);
  }

}
