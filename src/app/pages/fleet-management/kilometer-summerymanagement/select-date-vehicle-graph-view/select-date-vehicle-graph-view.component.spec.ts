import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDateVehicleGraphViewComponent } from './select-date-vehicle-graph-view.component';

describe('SelectDateVehicleGraphViewComponent', () => {
  let component: SelectDateVehicleGraphViewComponent;
  let fixture: ComponentFixture<SelectDateVehicleGraphViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectDateVehicleGraphViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDateVehicleGraphViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
