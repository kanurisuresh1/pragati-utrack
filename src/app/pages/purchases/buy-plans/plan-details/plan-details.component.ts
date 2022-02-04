import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ngx-plan-details',
  templateUrl: './plan-details.component.html',
  styleUrls: ['./plan-details.component.scss']
})
export class PlanDetailsComponent implements OnInit {

  constructor(private headerService: HeaderInteractorService, private apiService: UtrackService, private location: Location, private routes: Router,
    private uTrackService: UtrackService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.headerService.updateHeaderTitle('Plan Details')
    this.getDeviceList();
  }

  back() {
    this.location.back()
  }

  PurchasedPlansDetails() {
    this.routes.navigate([`../purchased-plan-details`],
      { relativeTo: this.activatedRoute })
  }

  getDeviceList() {
    this.apiService.getHomeLite().subscribe(response => {
      this.vehicles = response.data
    })
  }

  vehicles = []

  checks = false

  selectAllcheckBox(e) {
    if (e.target.checked == true) {
      this.checks = true;
    }
    else {
      this.checks = false;
    }
  }
}
