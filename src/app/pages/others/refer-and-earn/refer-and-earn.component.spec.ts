import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferAndEarnComponent } from './refer-and-earn.component';

describe('ReferAndEarnComponent', () => {
  let component: ReferAndEarnComponent;
  let fixture: ComponentFixture<ReferAndEarnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferAndEarnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferAndEarnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
