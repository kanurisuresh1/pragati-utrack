import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusTimingsComponent } from './bus-timings.component';

describe('BusTimingsComponent', () => {
  let component: BusTimingsComponent;
  let fixture: ComponentFixture<BusTimingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusTimingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusTimingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
