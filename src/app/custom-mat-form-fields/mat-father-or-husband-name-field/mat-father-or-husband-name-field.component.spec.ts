import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatFatherOrHusbandNameFieldComponent } from './mat-father-or-husband-name-field.component';

describe('MatFatherOrHusbandNameFieldComponent', () => {
  let component: MatFatherOrHusbandNameFieldComponent;
  let fixture: ComponentFixture<MatFatherOrHusbandNameFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatFatherOrHusbandNameFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatFatherOrHusbandNameFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
