import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { Location } from '@angular/common';
import { BuyPlansResponse } from '../../../../@theme/components/Model/BuyPlansResponse';
import { environment } from '../../../../../environments/environment';
import { OrderDetailsRespones } from '../../../../@theme/components/Model/OrderDetailsRespones';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  order_code: any;
  total_amount: any;
  order_status: any;
  order_date: any;
  payment_status: any;
  payment_date: any;
  shipping_amount: any;
  online_amount: any;
  wallet_amount: any;
  address_name: any;
  mobile: any;
  address_landmark: string;
  district_id: string;
  city_id: string;
  state_id: string;
  pincode: string;
  address: string;

  constructor(private headerService: HeaderInteractorService,
    private location: Location, private http: HttpClient, private uTrackService: UtrackService) { }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.headerService.updateHeaderTitle('Order Details');
    this.getOrderDetailsList();
  }

  back() {
    this.location.back()

  }

  getOrderDetailsList() {
    const params = new HttpParams()
      .set('user_id', localStorage.getItem("USER_ID"))
      .set('device_token', "Web")
      .set('order_id', localStorage.getItem("ORDER_CODE"))
      .set('X-Api-Key', environment.X_API_KEY)
    this.http.get<OrderDetailsRespones>(environment.apiBaseUrlProduct + 'order_detail', { params }).subscribe(response => {
      if (response.status) {

        this.order_code = response.data.order_code;
        this.total_amount = response.data.total_amount;
        this.order_status = response.data.order_status;
        this.order_date = response.data.order_date;
        this.payment_status = response.data.payment_status;
        this.payment_date = response.data.payment_date;
        this.shipping_amount = response.data.shipping_amount;
        this.online_amount = response.data.online_amount;
        this.wallet_amount = response.data.wallet_amount;
        this.address_name = response.data.address_name;
        this.mobile = response.data.mobile;
        this.address_landmark = response.data.address_landmark;
        this.city_id = response.data.city_id;
        this.district_id = response.data.district_id;
        this.state_id = response.data.state_id;
        this.pincode = response.data.pincode;
        this.address = response.data.address;

        this.products = response.data.order_product_list;


      }
    })
  }

  products = []
}
