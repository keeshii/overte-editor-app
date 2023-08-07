import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { MonacoEditorComponent } from './monaco-editor.component';
import { ApiService } from '../api/api.service';

describe('MonacoEditorComponent', () => {
  let component: MonacoEditorComponent;
  let fixture: ComponentFixture<MonacoEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonacoEditorComponent],
      providers: [
        { provide: ApiService, useValue: {} }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    fixture = TestBed.createComponent(MonacoEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
