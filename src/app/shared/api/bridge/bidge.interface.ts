import { Observable } from "rxjs";
import { Action } from "../../session/actions";

export enum BridgeEvent {
  INITIALIZE = 'INITIALIZE',
  SAVE = 'SAVE',
  RUN = 'RUN',
  RELOAD = 'RELOAD',
  CLOSE = 'CLOSE',
  STOP = 'STOP'
}

export interface Bridge {

  message$: Observable<Action>;

  sendEvent(event: BridgeEvent): void;

  sendAction(action: Action): void;

}
