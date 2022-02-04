import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GPSLockComponent } from './gpslock.component';

describe('GPSLockComponent', () => {
  let component: GPSLockComponent;
  let fixture: ComponentFixture<GPSLockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GPSLockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GPSLockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
