import { TestBed } from '@angular/core/testing';

import { HeaderInteractorService } from './header-interactor.service';

describe('HeaderInteractorService', () => {
  let service: HeaderInteractorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderInteractorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
