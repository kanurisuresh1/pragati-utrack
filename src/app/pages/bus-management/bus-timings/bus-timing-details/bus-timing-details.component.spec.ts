import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusTimingDetailsComponent } from './bus-timing-details.component';

describe('BusTimingDetailsComponent', () => {
  let component: BusTimingDetailsComponent;
  let fixture: ComponentFixture<BusTimingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusTimingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusTimingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
