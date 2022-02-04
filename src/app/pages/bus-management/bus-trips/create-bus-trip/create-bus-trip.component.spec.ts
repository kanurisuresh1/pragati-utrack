import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBusTripComponent } from './create-bus-trip.component';

describe('CreateBusTripComponent', () => {
  let component: CreateBusTripComponent;
  let fixture: ComponentFixture<CreateBusTripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBusTripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBusTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
