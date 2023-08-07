import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { StatusInfoComponent } from './status-info.component';
import { ApiService } from '../../shared/api/api.service';

describe('StatusInfoComponent', () => {
  let component: StatusInfoComponent;
  let fixture: ComponentFixture<StatusInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatusInfoComponent],
      providers: [
        { provide: ApiService, useValue: {} }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    fixture = TestBed.createComponent(StatusInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
