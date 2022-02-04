import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailGraphViewComponent } from './detail-graph-view.component';

describe('DetailGraphViewComponent', () => {
  let component: DetailGraphViewComponent;
  let fixture: ComponentFixture<DetailGraphViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailGraphViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailGraphViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
