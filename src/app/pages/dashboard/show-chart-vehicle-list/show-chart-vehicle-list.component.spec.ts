import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowChartVehicleListComponent } from './show-chart-vehicle-list.component';

describe('ShowChartVehicleListComponent', () => {
  let component: ShowChartVehicleListComponent;
  let fixture: ComponentFixture<ShowChartVehicleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowChartVehicleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowChartVehicleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
