import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { environment } from '../../../../environments/environment';
import { HttpParams, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { BuyProductsResponse } from '../../../@theme/components/Model/BuyProductsResponse';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-buy-products',
  templateUrl: './buy-products.component.html',
  styleUrls: ['./buy-products.component.scss']
})
export class BuyProductsComponent implements OnInit {


  constructor(private headerService: HeaderInteractorService, private http: HttpClient, private location: Location, private routes: Router,
    private activatedRoute: ActivatedRoute,
    private uTrackService: UtrackService) { }

  ngOnInit(): void {
    this.uTrackService.isUserValid();

    this.headerService.updateHeaderTitle('Buy Products')
    this.getBuyProductList();
  }

  num = 0;
  buyproductcount: number

  plus() {
    if (this.num !== 500) {
      this.num++;
      this.buyproductcount = this.num;
    }
  }
  minus() {
    if (this.num !== 0) {
      this.num--;
      this.buyproductcount = this.num;
    }
  }

  getBuyProductList() {
    const params = new HttpParams()
      .set('user_id', localStorage.getItem("USER_ID"))
      .set('device_token', "Web")
      .set('user_type', localStorage.getItem("USER_TYPE"))
      .set('X-Api-Key', environment.X_API_KEY)
    this.http.get<BuyProductsResponse>(environment.apiBaseUrlProduct + 'all', { params }).subscribe(response => {
      if (response.status) {
        this.BuyProductData = response.data
        this.BuyProductData.forEach((row) => {
          if (row.is_corporate == "No") {
            this.AllProductList.push(row)
          }
        })
      }
    })
  }

  BuyProductData = []

  AllProductList = []

  back() {
    this.location.back()
  }

  productDetails() {
    this.routes.navigate([`../product-details`],
      { relativeTo: this.activatedRoute })
  }
}
