import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyPlansComponent } from './buy-plans.component';

describe('BuyPlansComponent', () => {
  let component: BuyPlansComponent;
  let fixture: ComponentFixture<BuyPlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyPlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
