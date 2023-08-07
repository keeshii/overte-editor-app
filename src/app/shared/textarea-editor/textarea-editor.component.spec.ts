import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TextareaEditorComponent } from './textarea-editor.component';
import { ApiService } from '../api/api.service';

describe('TextareaEditorComponent', () => {
  let component: TextareaEditorComponent;
  let fixture: ComponentFixture<TextareaEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextareaEditorComponent],
      providers: [
        { provide: ApiService, useValue: {} }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    fixture = TestBed.createComponent(TextareaEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
