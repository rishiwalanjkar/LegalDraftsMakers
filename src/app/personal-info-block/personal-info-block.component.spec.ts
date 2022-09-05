import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInfoBlockComponent } from './personal-info-block.component';

describe('MatPersonalInfoFieldComponent', () => {
  let component: PersonalInfoBlockComponent;
  let fixture: ComponentFixture<PersonalInfoBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalInfoBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalInfoBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
