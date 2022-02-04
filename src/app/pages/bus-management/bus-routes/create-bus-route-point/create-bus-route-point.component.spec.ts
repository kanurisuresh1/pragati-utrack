import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBusRoutePointComponent } from './create-bus-route-point.component';

describe('CreateBusRoutePointComponent', () => {
  let component: CreateBusRoutePointComponent;
  let fixture: ComponentFixture<CreateBusRoutePointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBusRoutePointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBusRoutePointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
