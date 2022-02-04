import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasedPlanHistoryComponent } from './purchased-plan-history.component';

describe('PurchasedPlanHistoryComponent', () => {
  let component: PurchasedPlanHistoryComponent;
  let fixture: ComponentFixture<PurchasedPlanHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasedPlanHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasedPlanHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
