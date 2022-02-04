import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusPassengersComponent } from './bus-passengers.component';

describe('BusPassengersComponent', () => {
  let component: BusPassengersComponent;
  let fixture: ComponentFixture<BusPassengersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusPassengersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusPassengersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
