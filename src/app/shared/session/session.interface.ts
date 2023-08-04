import { Observable } from 'rxjs';

export interface Scroll {
  top: number;
  left: number;
}

export enum StatusType {
  UNLOADED = 'UNLOADED',
  PENDING = 'PENDING',
  RUNNING = 'RUNNING'
};

export interface LogItem {
  logType: 'INFO' | 'ERROR',
  items: any[];
  line?: number;
  col?: number;
}

export class Session {
  initialized = false;
  fileName = '';
  editorContent = '';
  scroll = { top: 0, left: 0 };
  status = StatusType.UNLOADED;
  logs: LogItem[] = [];
  consoleOpened = false;
}

export interface SessionGetters {
  get<T>(selector: (session: Session) => T): Observable<T>;
  get<T, R>(s1: (session: Session) => T, s2: (session: Session) => R): Observable<[T, R]>;
  get<T, R, S>(s1: (session: Session) => T, s2: (session: Session) => R, s3: (session: Session) => S): Observable<[T, R, S]>;
}
