import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackNearestVechileComponent } from './track-nearest-vechile.component';

describe('TrackNearestVechileComponent', () => {
  let component: TrackNearestVechileComponent;
  let fixture: ComponentFixture<TrackNearestVechileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackNearestVechileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackNearestVechileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
