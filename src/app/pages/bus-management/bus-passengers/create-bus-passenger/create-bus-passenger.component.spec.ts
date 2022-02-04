import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBusPassengerComponent } from './create-bus-passenger.component';

describe('CreateBusPassengerComponent', () => {
  let component: CreateBusPassengerComponent;
  let fixture: ComponentFixture<CreateBusPassengerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBusPassengerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBusPassengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
