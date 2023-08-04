import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaEditorComponent } from './textarea-editor.component';

describe('TextareaEditorComponent', () => {
  let component: TextareaEditorComponent;
  let fixture: ComponentFixture<TextareaEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextareaEditorComponent]
    });
    fixture = TestBed.createComponent(TextareaEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
