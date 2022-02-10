import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDraftTemplateComponent } from './create-draft-template.component';

describe('CreateDraftTemplateComponent', () => {
  let component: CreateDraftTemplateComponent;
  let fixture: ComponentFixture<CreateDraftTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDraftTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDraftTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
