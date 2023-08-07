import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { AlertService } from './shared/alert/alert.service';
import { ApiService } from './shared/api/api.service';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [AppComponent],
    providers: [
      { provide: ApiService, useValue: {} },
      { provide: AlertService, useValue: {} }
    ],
    schemas: [ NO_ERRORS_SCHEMA ]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
