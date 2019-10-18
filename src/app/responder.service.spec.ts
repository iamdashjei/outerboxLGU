import { TestBed } from '@angular/core/testing';

import { ResponderService } from './responder.service';

describe('ResponderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResponderService = TestBed.get(ResponderService);
    expect(service).toBeTruthy();
  });
});
