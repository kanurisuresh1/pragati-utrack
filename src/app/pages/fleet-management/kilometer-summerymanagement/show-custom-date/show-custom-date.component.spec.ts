import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCustomDateComponent } from './show-custom-date.component';

describe('ShowCustomDateComponent', () => {
  let component: ShowCustomDateComponent;
  let fixture: ComponentFixture<ShowCustomDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowCustomDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCustomDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
