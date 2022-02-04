import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Location } from '@angular/common';
import { DevicePlanSubscriptionlListResponse } from '../../../../@theme/components/Model/DevicePlanSubscriptionlListResponse';
import { DatePipe } from '@angular/common';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-purchased-plan-details',
  templateUrl: './purchased-plan-details.component.html',
  styleUrls: ['./purchased-plan-details.component.scss']
})
export class PurchasedPlanDetailsComponent implements OnInit {
  datepipe = new DatePipe('en-us');
  purchased_date: string;
  start_date: string;
  end_date: string;

  constructor(private headerService: HeaderInteractorService,
    private uTrackService: UtrackService, private http: HttpClient, private location: Location) { }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.headerService.updateHeaderTitle('Purchased Plan Details')
    this.getPurchasedPlanDetailsList();
  }

  getPurchasedPlanDetailsList() {
    const params = new HttpParams()
      .set('user_id', localStorage.getItem("USER_ID"))
      .set('device_token', "Web")
      .set('user_type', localStorage.getItem("USER_TYPE"))
      .set('device_link_id', '')
      .set('X-Api-Key', environment.X_API_KEY)
    this.http.get<DevicePlanSubscriptionlListResponse>(environment.apiBaseUrl + 'device_plan_subscription_list', { params }).subscribe(response => {
      if (response.status) {
        this.PurchasedPlanDetailsData = response.data
        this.PurchasedPlanDetailsData.forEach((row) => {
          row.purchased_date = this.datepipe.transform(new Date(row.purchased_date), 'dd MMM yyyy hh:mm:ss a');
          row.start_date = this.datepipe.transform(new Date(row.start_date), 'dd MMM yyyy');
          row.end_date = this.datepipe.transform(new Date(row.end_date), 'dd MMM yyyy');
        })

      }
    })
  }

  PurchasedPlanDetailsData = []

  back() {
    this.location.back()
  }

}
