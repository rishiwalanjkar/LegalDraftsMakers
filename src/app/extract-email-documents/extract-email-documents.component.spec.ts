import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractEmailDocumentsComponent } from './extract-email-documents.component';

describe('ExtractEmailDocumentsComponent', () => {
  let component: ExtractEmailDocumentsComponent;
  let fixture: ComponentFixture<ExtractEmailDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtractEmailDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtractEmailDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
