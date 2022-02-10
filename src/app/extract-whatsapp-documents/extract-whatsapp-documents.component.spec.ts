import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractWhatsappDocumentsComponent } from './extract-whatsapp-documents.component';

describe('ExtractWhatsappDocumentsComponent', () => {
  let component: ExtractWhatsappDocumentsComponent;
  let fixture: ComponentFixture<ExtractWhatsappDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtractWhatsappDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtractWhatsappDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
