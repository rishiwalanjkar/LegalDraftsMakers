import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomToolComponent } from './custom-tool.component';

describe('CustomToolComponent', () => {
  let component: CustomToolComponent;
  let fixture: ComponentFixture<CustomToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomToolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
