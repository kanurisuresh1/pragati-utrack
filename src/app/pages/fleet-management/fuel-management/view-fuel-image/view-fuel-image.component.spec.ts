import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFuelImageComponent } from './view-fuel-image.component';

describe('ViewFuelImageComponent', () => {
  let component: ViewFuelImageComponent;
  let fixture: ComponentFixture<ViewFuelImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFuelImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFuelImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
