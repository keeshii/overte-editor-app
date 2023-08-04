import { StatusType } from "./session.interface";

export enum ActionType {
  SET_STATE = 'SET_STATE',
  SET_FILE_NAME = 'SET_FILE_NAME',
  SHOW_MESSAGE = 'SHOW_MESSAGE',
  SET_STATUS = 'SET_STATUS',
  LOG_ERROR = 'LOG_ERROR',
  LOG_INFO = 'LOG_INFO',
  UPDATE = 'UPDATE',
  SET_SCROLL = 'SET_SCROLL',
  SET_SELECTION = 'SET_SELECTION'
}

export class SetStateAction {
  public readonly type: string = ActionType.SET_STATE;
  constructor(
    public content: string,
    public fileName?: string,
    public status?: StatusType
  ) {}
}

export class SetFileNameAction {
  public readonly type: string = ActionType.SET_FILE_NAME;
  constructor(
    public fileName: string
  ) {}
}

export class ShowMessageAction {
  public readonly type: string = ActionType.SHOW_MESSAGE;
  constructor(
    public message: string
  ) {}
}

export class UpdateAction {
  public readonly type: string = ActionType.UPDATE;
  constructor(
    public position: number,
    public remove: number,
    public insert: string
  ) {}
}

export class SetStatusAction {
  public readonly type: string = ActionType.SET_STATUS;
  constructor(
    public status: StatusType
  ) {}
}

export class LogErrorAction {
  public readonly type: string = ActionType.LOG_ERROR;
  public line?: number;
  public col?: number;
  constructor(
    public error: string
  ) {}
}

export class LogInfoAction {
  public readonly type: string = ActionType.LOG_INFO;
  constructor(
    public items: any[]
  ) {}
}

export class SetScrollAction {
  public readonly type: string = ActionType.SET_SCROLL;
  constructor(
    public top: number,
    public left: number,
  ) {}
}

export type Action
  = SetStateAction
  | SetFileNameAction
  | ShowMessageAction
  | UpdateAction
  | SetStatusAction
  | LogErrorAction
  | LogInfoAction
  | SetScrollAction;
