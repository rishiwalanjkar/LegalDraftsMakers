import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatNameFieldComponent } from './mat-name-field.component';

describe('MatNameFieldComponent', () => {
  let component: MatNameFieldComponent;
  let fixture: ComponentFixture<MatNameFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatNameFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatNameFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
