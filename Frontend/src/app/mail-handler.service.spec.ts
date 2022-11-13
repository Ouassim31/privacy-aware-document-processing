import { TestBed } from '@angular/core/testing';

import { MailHandlerService } from './mail-handler.service';

describe('MailHandlerService', () => {
  let service: MailHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MailHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
