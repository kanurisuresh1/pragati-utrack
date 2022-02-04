import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFuelAlertComponent } from './add-fuel-alert.component';

describe('AddFuelAlertComponent', () => {
  let component: AddFuelAlertComponent;
  let fixture: ComponentFixture<AddFuelAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFuelAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFuelAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
