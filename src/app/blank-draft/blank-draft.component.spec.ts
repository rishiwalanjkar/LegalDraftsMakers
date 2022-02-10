import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlankDraftComponent } from './blank-draft.component';

describe('BlankDraftComponent', () => {
  let component: BlankDraftComponent;
  let fixture: ComponentFixture<BlankDraftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlankDraftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlankDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
