import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTrackHistoryComponent } from './new-track-history.component';

describe('NewTrackHistoryComponent', () => {
  let component: NewTrackHistoryComponent;
  let fixture: ComponentFixture<NewTrackHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTrackHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTrackHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
