import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyUtrackComponent } from './why-utrack.component';

describe('WhyUtrackComponent', () => {
  let component: WhyUtrackComponent;
  let fixture: ComponentFixture<WhyUtrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhyUtrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhyUtrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
