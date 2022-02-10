import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCustomerProfileComponent } from './create-customer-profile.component';

describe('CreateCustomerProfileComponent', () => {
  let component: CreateCustomerProfileComponent;
  let fixture: ComponentFixture<CreateCustomerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCustomerProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCustomerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
