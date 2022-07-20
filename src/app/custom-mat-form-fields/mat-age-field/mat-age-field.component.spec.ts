import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatAgeFieldComponent } from './mat-age-field.component';

describe('MatAgeFieldComponent', () => {
  let component: MatAgeFieldComponent;
  let fixture: ComponentFixture<MatAgeFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatAgeFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatAgeFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
