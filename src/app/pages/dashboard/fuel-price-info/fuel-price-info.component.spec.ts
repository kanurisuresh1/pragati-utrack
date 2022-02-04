import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelPriceInfoComponent } from './fuel-price-info.component';

describe('FuelPriceInfoComponent', () => {
  let component: FuelPriceInfoComponent;
  let fixture: ComponentFixture<FuelPriceInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelPriceInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelPriceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
