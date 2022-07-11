import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogToolComponent } from './dialog-tool.component';

describe('DialogToolComponent', () => {
  let component: DialogToolComponent;
  let fixture: ComponentFixture<DialogToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogToolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
