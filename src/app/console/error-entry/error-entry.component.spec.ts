import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ErrorEntryComponent } from './error-entry.component';

describe('ErrorEntryComponent', () => {
  let component: ErrorEntryComponent;
  let fixture: ComponentFixture<ErrorEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorEntryComponent],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    fixture = TestBed.createComponent(ErrorEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
