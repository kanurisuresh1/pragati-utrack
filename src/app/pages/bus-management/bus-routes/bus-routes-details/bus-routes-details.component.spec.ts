import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusRoutesDetailsComponent } from './bus-routes-details.component';

describe('BusRoutesDetailsComponent', () => {
  let component: BusRoutesDetailsComponent;
  let fixture: ComponentFixture<BusRoutesDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusRoutesDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusRoutesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
