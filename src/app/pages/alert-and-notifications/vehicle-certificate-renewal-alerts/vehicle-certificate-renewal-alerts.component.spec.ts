import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleCertificateRenewalAlertsComponent } from './vehicle-certificate-renewal-alerts.component';

describe('VehicleCertificateRenewalAlertsComponent', () => {
  let component: VehicleCertificateRenewalAlertsComponent;
  let fixture: ComponentFixture<VehicleCertificateRenewalAlertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleCertificateRenewalAlertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleCertificateRenewalAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
