import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyDraftComponent } from './ready-draft.component';

describe('ReadyDraftComponent', () => {
  let component: ReadyDraftComponent;
  let fixture: ComponentFixture<ReadyDraftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadyDraftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadyDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
