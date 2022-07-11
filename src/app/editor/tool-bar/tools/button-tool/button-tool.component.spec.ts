import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonToolComponent } from './button-tool.component';

describe('ButtonToolComponent', () => {
  let component: ButtonToolComponent;
  let fixture: ComponentFixture<ButtonToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonToolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
