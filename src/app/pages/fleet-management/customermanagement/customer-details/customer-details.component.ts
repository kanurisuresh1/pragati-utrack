import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CustomersDetails } from '../../../../@theme/components/Model/CustomerManagementDetails';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {
  customerId: any;
  customerDetails: any;
  customerName: any;
  customerMobile: any;
  customerEmail: any;
  companyName: any;
  gstNo: any;
  registerdDate: any;
  stateName: any;
  fullAddress: any;
  constructor(private headerService: HeaderInteractorService,
    private http: HttpClient,
    private location: Location,
    private activatedRoute: ActivatedRoute, private uTrackService: UtrackService,
 
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.customerId = params.customer_id;
    })

  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
 
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Customer Details');
    this.getCustomerDetails();
  }
  back() {
    this.location.back();
  }
  getCustomerDetails() {
    const params = new HttpParams()
      .set('user_id', localStorage.getItem('USER_ID'))
      .set('device_token', "web")
      .set('user_type', localStorage.getItem("USER_TYPE"))
      .set('customer_id', this.customerId)
      .set('X-Api-Key', environment.X_API_KEY)

    this.http.get<CustomersDetails>(environment.apiBaseUrl + 'my_customer_detail', { params }).subscribe(response => {
      if (response.status) {
        this.customerDetails = response.data
        this.customerName = response.data.full_name;
        this.customerMobile = response.data.mobile;
        this.customerEmail = response.data.email;
        this.companyName = response.data.company_name;
        this.gstNo = response.data.gst_number;
        this.registerdDate = response.data.added_date;
        this.stateName = response.data.state;
        this.fullAddress = response.data.address2 + ' ' + response.data.address1;
      } else {
      }
    })

  }

}
