import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedUserDetailsComponent } from './shared-user-details.component';

describe('SharedUserDetailsComponent', () => {
  let component: SharedUserDetailsComponent;
  let fixture: ComponentFixture<SharedUserDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedUserDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
