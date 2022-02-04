import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LessKmStopDataNotReceiveComponent } from './less-km-stop-data-not-receive.component';

describe('LessKmStopDataNotReceiveComponent', () => {
  let component: LessKmStopDataNotReceiveComponent;
  let fixture: ComponentFixture<LessKmStopDataNotReceiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LessKmStopDataNotReceiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessKmStopDataNotReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
