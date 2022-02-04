import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { Location } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { HttpParams, HttpClient } from '@angular/common/http';
import { PurchasedPlanHistoryResponse } from '../../../../@theme/components/Model/PurchasedPlanHistoryResponse';
import { DatePipe } from '@angular/common';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-purchased-plan-history',
  templateUrl: './purchased-plan-history.component.html',
  styleUrls: ['./purchased-plan-history.component.scss']
})
export class PurchasedPlanHistoryComponent implements OnInit {
  datepipe = new DatePipe('en-us');
  payment_date: string;

  constructor(private headerService: HeaderInteractorService,
    private uTrackService: UtrackService, private location: Location, private http: HttpClient) { }

  ngOnInit(): void {
    this.uTrackService.isUserValid();

    this.headerService.updateHeaderTitle('Purchased Plan History')
    this.getPurchasedPlanHistoryList();
  }

  back() {
    this.location.back()
  }

  getPurchasedPlanHistoryList() {
    const params = new HttpParams()
      .set('user_id', localStorage.getItem("USER_ID"))
      .set('device_token', "Web")
      .set('user_type', localStorage.getItem("USER_TYPE"))
      .set('X-Api-Key', environment.X_API_KEY)
    this.http.get<PurchasedPlanHistoryResponse>(environment.apiBaseUrl + 'plan_payment_transaction_list', { params }).subscribe(response => {
      if (response.status) {
        this.PurchasedPlanHistorysData = response.data

        this.PurchasedPlanHistorysData.forEach((row) => {
          row.payment_date = this.datepipe.transform(new Date(row.payment_date), 'dd MMM yyyy hh:mm:ss a');
        })

      }
    })
  }

  PurchasedPlanHistorysData = []

}
