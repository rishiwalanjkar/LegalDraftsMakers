import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogIncomeComponent } from './log-income.component';

describe('LogIncomeComponent', () => {
  let component: LogIncomeComponent;
  let fixture: ComponentFixture<LogIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogIncomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
