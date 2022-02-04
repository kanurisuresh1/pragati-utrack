import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusGeofencesComponent } from './bus-geofences.component';

describe('BusGeofencesComponent', () => {
  let component: BusGeofencesComponent;
  let fixture: ComponentFixture<BusGeofencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusGeofencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusGeofencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
