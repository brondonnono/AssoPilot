import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cotisations } from './cotisations';

describe('Cotisations', () => {
  let component: Cotisations;
  let fixture: ComponentFixture<Cotisations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cotisations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cotisations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
