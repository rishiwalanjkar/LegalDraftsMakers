import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatPanNumberFieldComponent } from './mat-pan-number-field.component';

describe('MatPanNumberFieldComponent', () => {
  let component: MatPanNumberFieldComponent;
  let fixture: ComponentFixture<MatPanNumberFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatPanNumberFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatPanNumberFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
