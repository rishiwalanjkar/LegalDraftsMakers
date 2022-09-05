import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatOccupationFieldComponent } from './mat-occupation-field.component';

describe('MatOccupationFieldComponent', () => {
  let component: MatOccupationFieldComponent;
  let fixture: ComponentFixture<MatOccupationFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatOccupationFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatOccupationFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
