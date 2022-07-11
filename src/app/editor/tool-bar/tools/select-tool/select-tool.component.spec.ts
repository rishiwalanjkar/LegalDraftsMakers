import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectToolComponent } from './select-tool.component';

describe('SelectToolComponent', () => {
  let component: SelectToolComponent;
  let fixture: ComponentFixture<SelectToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectToolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
