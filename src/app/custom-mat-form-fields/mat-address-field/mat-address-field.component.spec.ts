import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatAddressFieldComponent } from './mat-address-field.component';

describe('MatAddressFieldComponent', () => {
  let component: MatAddressFieldComponent;
  let fixture: ComponentFixture<MatAddressFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatAddressFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatAddressFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
