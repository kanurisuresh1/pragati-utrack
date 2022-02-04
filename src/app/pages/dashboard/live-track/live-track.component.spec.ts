import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveTrackComponent } from './live-track.component';

describe('LiveTrackComponent', () => {
  let component: LiveTrackComponent;
  let fixture: ComponentFixture<LiveTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
