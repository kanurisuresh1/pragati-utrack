import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMonthGraphViewComponent } from './select-month-graph-view.component';

describe('SelectMonthGraphViewComponent', () => {
  let component: SelectMonthGraphViewComponent;
  let fixture: ComponentFixture<SelectMonthGraphViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectMonthGraphViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMonthGraphViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
