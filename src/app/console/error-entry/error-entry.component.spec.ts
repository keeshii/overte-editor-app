import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorEntryComponent } from './error-entry.component';

describe('ErrorEntryComponent', () => {
  let component: ErrorEntryComponent;
  let fixture: ComponentFixture<ErrorEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorEntryComponent]
    });
    fixture = TestBed.createComponent(ErrorEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
