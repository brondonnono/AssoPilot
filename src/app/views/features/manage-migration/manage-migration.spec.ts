import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMigration } from './manage-migration';

describe('ManageMigration', () => {
  let component: ManageMigration;
  let fixture: ComponentFixture<ManageMigration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageMigration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageMigration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
