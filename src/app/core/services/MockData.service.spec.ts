/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MockDataService } from './MockData.service';

describe('Service: MockData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockDataService]
    });
  });

  it('should ...', inject([MockDataService], (service: MockDataService) => {
    expect(service).toBeTruthy();
  }));
});
