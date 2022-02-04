import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { environment } from '../../../../environments/environment';
import { HttpParams, HttpClient } from '@angular/common/http';
import { BuyPlansResponse } from '../../../@theme/components/Model/BuyPlansResponse';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-buy-plans',
  templateUrl: './buy-plans.component.html',
  styleUrls: ['./buy-plans.component.scss']
})
export class BuyPlansComponent implements OnInit {

  constructor(private headerService: HeaderInteractorService, private http: HttpClient, private location: Location, private routes: Router,
    private activatedRoute: ActivatedRoute, private uTrackService: UtrackService) { }

  ngOnInit(): void {
    this.uTrackService.isUserValid();

    this.headerService.updateHeaderTitle('Buy Plans')
    this.getBuyPlansList()
  }


  getBuyPlansList() {
    const params = new HttpParams()
      .set('user_id', localStorage.getItem("USER_ID"))
      .set('device_token', "Web")
      .set('user_type', localStorage.getItem("USER_TYPE"))
      .set('X-Api-Key', environment.X_API_KEY)
    this.http.get<BuyPlansResponse>(environment.apiBaseUrl + 'all_plans_list', { params }).subscribe(response => {
      if (response.status) {
        this.BuyPlanesData = response.data

      }
    })
  }

  BuyPlanesData = []

  back() {
    this.location.back()
  }

  PurchasedPlansHistory() {
    this.routes.navigate([`../purchased-plan-history`],
      { relativeTo: this.activatedRoute })
  }

  plansDetails() {
    this.routes.navigate([`../plan-details`],
      { relativeTo: this.activatedRoute })
  }
}
