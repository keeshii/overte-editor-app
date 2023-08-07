import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { editor } from 'monaco-editor';
import { LogItem } from '../session/session.interface';
import { EditorService } from '../session/editor.service';
import { SessionService } from '../session/session.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ApiService } from '../api/api.service';
import { SetScrollAction } from '../session/actions';

@Component({
  selector: 'ovt-monaco-editor',
  templateUrl: './monaco-editor.component.html',
  styleUrls: ['./monaco-editor.component.scss']
})
export class MonacoEditorComponent implements OnInit, OnDestroy {

  public content = '';
  private readOnly = true;
  private editorContent = '';
  private editorChangeDisabled = false;
  private editor?: editor.ICodeEditor;
  private subscriptions: Subscription[] = [];
  private scrollTop = 0;
  private scrollLeft = 0;
  private updateSubject = new Subject<void>();
  private scrollSubject = new Subject<{ top: number, left: number }>();
  private errorDecoration?: editor.IEditorDecorationsCollection;

  public editorOptions = {
    theme: 'vs-dark',
    language: 'javascript',
    atomicLayout: true,
    scrollBeyondLastLine: false,
    readOnly: false
  };

  @Input()
  public set disabled(value: boolean) {
    this.readOnly = value;
    this.editorOptions = { ...this.editorOptions, readOnly: value };
  }

  constructor(
    private apiService: ApiService,
    private editorService: EditorService,
    private sessionService: SessionService
  ) {}

  public ngOnInit() {
    this.subscriptions.push(this.sessionService.get(session => session.editorContent)
      .subscribe(editorContent => {
        if (this.editorContent === editorContent) {
          return;
        }
        this.editorChangeDisabled = true;
        const prevState = this.editorContent;
        this.editorContent = editorContent;
        this.updateEditor(prevState, this.editorContent);
        this.editorChangeDisabled = false;
      }));

    this.subscriptions.push(this.sessionService.get(session => session.scroll)
      .subscribe(scroll => {
        this.updateScroll(scroll.top, scroll.left);
      }));

    this.subscriptions.push(this.sessionService.get(session => session.consoleOpened)
      .subscribe(() => {
        setTimeout(() => this.editor && this.editor.layout());
      }));

    this.subscriptions.push(this.editorService.errorObservable
      .subscribe(lastError => {
        this.updateError(lastError);
      }));

    this.subscriptions.push(this.editorService.goToObservable
      .subscribe(position => {
        this.goToLine(position.lineNumber, position.column);
      }));

    this.subscriptions.push(this.updateSubject.pipe(debounceTime(100))
      .subscribe(() => {
        if (this.editorContent === this.content) {
          return;
        }
        const previousContent = this.editorContent;
        this.editorContent = this.content;
        const updateAction = this.editorService.createUpdateAction(previousContent, this.content);
        this.apiService.sendAction(updateAction);
      }));

    this.subscriptions.push(this.scrollSubject.pipe(debounceTime(100))
      .subscribe(scroll => {
        this.apiService.sendAction(new SetScrollAction(scroll.top, scroll.left));
      }));
  }

  public ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public onChange() {
    if (!this.editorChangeDisabled) {
      this.updateSubject.next();
    }
  }

  public onEditorInit(editor: editor.ICodeEditor) {
    this.editor = editor;
    this.updateEditor(editor.getValue(), this.editorContent);

    editor.onDidScrollChange(event => {
      if (event.scrollTop !== this.scrollTop || event.scrollLeft !== this.scrollLeft) {
        this.scrollTop = event.scrollTop;
        this.scrollLeft = event.scrollLeft;
        this.scrollSubject.next({ top: this.scrollTop, left: this.scrollLeft });
      }
    });
  }

  private updateEditor(prev: string, content: string): void {
    if (!this.editor) {
      return;
    }
    const update = this.editorService.createUpdateAction(prev, content);
    const start = this.editorService.indexToLineCol(prev, update.position);
    const end = this.editorService.indexToLineCol(prev, update.position + update.remove);
    const edit: editor.ISingleEditOperation = {
      range: {
        startLineNumber: start.lineNumber,
        startColumn: start.column,
        endLineNumber: end.lineNumber,
        endColumn: end.column
      },
      text: update.insert,
      forceMoveMarkers: true
    };
    this.editor.executeEdits('external', [edit]);
  }

  private updateScroll(scrollTop: number, scrollLeft: number) {
    if (!this.editor) {
      return;
    }
    if (this.scrollTop === scrollTop && this.scrollLeft === scrollLeft) {
      return;
    }
    this.scrollTop = scrollTop;
    this.scrollLeft = scrollLeft;
    this.editor.setScrollPosition({ scrollTop, scrollLeft });
  }

  private updateError(error?: LogItem) {
    if (!this.editor) {
      return;
    }
    if (this.errorDecoration) {
      this.errorDecoration.clear();
      this.errorDecoration = undefined;
    }
    if (error === undefined) {
      return;
    }
    const message = error.items.length ? String(error.items[0]) : '';
    if (!message || error.line === undefined || error.col === undefined) {
      return;
    }
    this.errorDecoration = this.editor.createDecorationsCollection([{
      range: {
        startLineNumber: error.line,
        startColumn: error.col,
        endLineNumber: error.line,
        endColumn: error.col
      },
      options: {
        isWholeLine: true,
        className: "ovt-error-line",
        hoverMessage: { value: message },
      }
    }]);
  }

  private goToLine(lineNumber: number, column: number) {
    if (!this.editor) {
      return;
    }
    this.editor.revealLineInCenter(lineNumber);
    this.editor.setPosition({ lineNumber, column });
    this.editor.focus();
  }

}
