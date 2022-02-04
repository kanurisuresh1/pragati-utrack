import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasedPlanDetailsComponent } from './purchased-plan-details.component';

describe('PurchasedPlanDetailsComponent', () => {
  let component: PurchasedPlanDetailsComponent;
  let fixture: ComponentFixture<PurchasedPlanDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasedPlanDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasedPlanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
