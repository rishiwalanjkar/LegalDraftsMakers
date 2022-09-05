import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatAdharNumberFieldComponent } from './mat-adhar-number-field.component';

describe('MatAdharNumberFieldComponent', () => {
  let component: MatAdharNumberFieldComponent;
  let fixture: ComponentFixture<MatAdharNumberFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatAdharNumberFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatAdharNumberFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
