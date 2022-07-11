import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDividedInputComponent } from './mat-divided-input.component';

describe('MatDividedInputComponent', () => {
  let component: MatDividedInputComponent;
  let fixture: ComponentFixture<MatDividedInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatDividedInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatDividedInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
