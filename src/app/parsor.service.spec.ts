import { TestBed } from '@angular/core/testing';

import { ParsorService } from './parsor.service';

describe('ParsorService', () => {
  let service: ParsorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParsorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
