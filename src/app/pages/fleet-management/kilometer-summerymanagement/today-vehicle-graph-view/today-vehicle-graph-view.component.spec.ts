import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayVehicleGraphViewComponent } from './today-vehicle-graph-view.component';

describe('TodayVehicleGraphViewComponent', () => {
  let component: TodayVehicleGraphViewComponent;
  let fixture: ComponentFixture<TodayVehicleGraphViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodayVehicleGraphViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodayVehicleGraphViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
