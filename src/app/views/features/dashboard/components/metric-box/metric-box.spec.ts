import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricBox } from './metric-box';

describe('MetricBox', () => {
  let component: MetricBox;
  let fixture: ComponentFixture<MetricBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricBox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetricBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
