import { Injectable } from '@angular/core';
import { Action, UpdateAction } from './actions';
import { LogItem } from './session.interface';
import { Observable, Subject } from 'rxjs';
import { IPosition } from 'monaco-editor';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  private goToSubject = new Subject<IPosition>();
  public goToObservable: Observable<IPosition>;
  private errorSubject = new Subject<LogItem | undefined>();
  public errorObservable: Observable<LogItem | undefined>;

  constructor() {
    this.goToObservable = this.goToSubject.asObservable();
    this.errorObservable = this.errorSubject.asObservable();
  }

  public applyUpdate(content: string, action: UpdateAction): string { 
    if (!action.remove && !action.insert) {
      return content;
    }

    const text = content;
    return text.substring(0, action.position)
      + action.insert
      + text.substring(action.position + action.remove);
  }

  public createUpdateAction(text: string, newText: string) {
    let prefix = 0;
    let suffix = 0;
    let i = 0, j = 0;

    while (i < text.length && i < newText.length && text[i] === newText[i]) {
      i++;
      prefix++;
    }

    i = text.length - 1;
    j = newText.length - 1;
    while (i >= prefix && j >= prefix && text[i] === newText[j]) {
      i--;
      j--;
      suffix++;
    }

    const remove = text.length - prefix - suffix;
    const insert = newText.substring(prefix, newText.length - suffix);

    return new UpdateAction(prefix, remove, insert);
  }

  public goToLine(lineNumber: number, column: number) {
    this.goToSubject.next({ lineNumber, column });
  }

  public clearError() {
    this.errorSubject.next(undefined);
  }

  public showError(error?: LogItem) {
    if (!error || error.logType !== 'ERROR') {
      this.errorSubject.next(undefined);
      return;
    }
    const message = error.items.length ? String(error.items[0]) : '';
    if (!message || error.line === undefined || error.col === undefined) {
      this.errorSubject.next(undefined);
      return;
    }
    this.errorSubject.next(error);
  }

  public lineColToIndex(text: string, lineNumber: number, column: number): number {
    let pos = 0;
    let line = 1;

    while (line < lineNumber && pos < text.length) {
      if (text[pos] === '\n') {
        line++;
      }
      pos++;
    }

    let col = 1;
    while (col < column && pos < text.length) {
      if (text[pos] === '\n') {
        break;
      }
      col++;
      pos++;
    }

    return pos;
  }

  public indexToLineCol(text: string, pos: number): IPosition {
    let lineNumber = 1;
    let column = 1;
    let i = 0;
    
    while (i < text.length && i < pos) {
      if (text[i] === '\n') {
        column = 0;
        lineNumber++;
      }
      i++;
      column++;
    }

    return { lineNumber, column };
  }

  public getUpdatedPosition(prevContent: string, content: string, lineNumber: number, column: number): IPosition {
    const oldIndex = this.lineColToIndex(prevContent, lineNumber, column);
    const action = this.createUpdateAction(prevContent, content);

    let newIndex = oldIndex;
    if (oldIndex >= action.position) {
      newIndex = oldIndex - action.remove + action.insert.length;
    }

    return this.indexToLineCol(content, newIndex);
  }
}
