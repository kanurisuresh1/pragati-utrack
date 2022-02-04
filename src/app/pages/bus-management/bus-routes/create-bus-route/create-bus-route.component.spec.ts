import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBusRouteComponent } from './create-bus-route.component';

describe('CreateBusRouteComponent', () => {
  let component: CreateBusRouteComponent;
  let fixture: ComponentFixture<CreateBusRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBusRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBusRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
