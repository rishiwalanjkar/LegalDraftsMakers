import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonWithSelectToolComponent } from './button-with-select-tool.component';

describe('ButtonWithSelectToolComponent', () => {
  let component: ButtonWithSelectToolComponent;
  let fixture: ComponentFixture<ButtonWithSelectToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonWithSelectToolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonWithSelectToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
