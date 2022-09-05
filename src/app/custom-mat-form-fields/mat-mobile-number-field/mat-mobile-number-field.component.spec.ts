import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatMobileNumberFieldComponent } from './mat-mobile-number-field.component';

describe('MatMobileNumberFieldComponent', () => {
  let component: MatMobileNumberFieldComponent;
  let fixture: ComponentFixture<MatMobileNumberFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatMobileNumberFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatMobileNumberFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
