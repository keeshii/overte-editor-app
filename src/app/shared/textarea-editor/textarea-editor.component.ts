import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from '../api/api.service';
import { EditorService } from '../session/editor.service';
import { SessionService } from '../session/session.service';

@Component({
  selector: 'ovt-textarea-editor',
  templateUrl: './textarea-editor.component.html',
  styleUrls: ['./textarea-editor.component.scss']
})
export class TextareaEditorComponent {
  @Input()
  public disabled = false;

  public content = '';
  private editorContent = '';
  private editorChangeDisabled = false;
  private subscription?: Subscription;

  public editorOptions = {
    theme: 'vs-dark',
    language: 'javascript',
    atomicLayout: true,
    scrollBeyondLastLine: false
  };

  constructor(
    private apiService: ApiService,
    private editorService: EditorService,
    private sessionService: SessionService
  ) {}

  public ngOnInit() {
    this.subscription = this.sessionService.get(session => session.editorContent)
      .subscribe(editorContent => {
        if (this.content === editorContent) {
          return;
        }
        this.editorChangeDisabled = true;
        const prevState = this.editorContent;
        this.editorContent = editorContent;
        this.updateEditor(prevState, this.editorContent);
        this.editorChangeDisabled = false;
      });

    this.updateEditor('', this.editorContent);
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public onChange(event: string) {
    const previousContent = this.editorContent;
    this.editorContent = event;
    if (!this.editorChangeDisabled) {

      // send update action to websocket
      const updateAction = this.editorService.createUpdateAction(previousContent, this.content);
      this.apiService.sendAction(updateAction);
    }
  }

  private updateEditor(prev: string, content: string): void {
    this.content = content;
  }
}
