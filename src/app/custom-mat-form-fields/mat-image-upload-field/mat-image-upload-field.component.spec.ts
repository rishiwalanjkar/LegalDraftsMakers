import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatImageUploadFieldComponent } from './mat-image-upload-field.component';

describe('MatImageUploadFieldComponent', () => {
  let component: MatImageUploadFieldComponent;
  let fixture: ComponentFixture<MatImageUploadFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatImageUploadFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatImageUploadFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
