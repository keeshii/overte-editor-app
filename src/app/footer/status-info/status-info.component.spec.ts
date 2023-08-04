import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusInfoComponent } from './status-info.component';

describe('StatusInfoComponent', () => {
  let component: StatusInfoComponent;
  let fixture: ComponentFixture<StatusInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatusInfoComponent]
    });
    fixture = TestBed.createComponent(StatusInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
