import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CumulativeGraphViewComponent } from './cumulative-graph-view.component';

describe('CumulativeGraphViewComponent', () => {
  let component: CumulativeGraphViewComponent;
  let fixture: ComponentFixture<CumulativeGraphViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CumulativeGraphViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CumulativeGraphViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
