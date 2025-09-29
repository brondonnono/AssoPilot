import { TestBed } from '@angular/core/testing';
import { LogsModule } from './logs.module';

describe('LogsModule', () => {
  let pipe: LogsModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [LogsModule] });
    pipe = TestBed.inject(LogsModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
