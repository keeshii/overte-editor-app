import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { environment } from "../../../environments/environment";

describe('ApiService', () => {
  let service: ApiService;
  let environmentBridge: string;

  beforeEach(() => {
    environmentBridge = environment.bridge
    environment.bridge = 'mock';

    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiService);
  });

  afterEach(() => {
    environment.bridge = environmentBridge;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
