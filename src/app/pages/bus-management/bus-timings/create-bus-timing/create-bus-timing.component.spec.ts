import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBusTimingComponent } from './create-bus-timing.component';

describe('CreateBusTimingComponent', () => {
  let component: CreateBusTimingComponent;
  let fixture: ComponentFixture<CreateBusTimingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBusTimingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBusTimingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
