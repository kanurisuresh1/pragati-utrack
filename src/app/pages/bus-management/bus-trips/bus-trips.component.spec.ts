import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusTripsComponent } from './bus-trips.component';

describe('BusTripsComponent', () => {
  let component: BusTripsComponent;
  let fixture: ComponentFixture<BusTripsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusTripsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
