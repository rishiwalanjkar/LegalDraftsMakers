import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFontsComponent } from './upload-fonts.component';

describe('UploadFontsComponent', () => {
  let component: UploadFontsComponent;
  let fixture: ComponentFixture<UploadFontsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadFontsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFontsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
