import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-company-management-details',
  templateUrl: './company-management-details.component.html',
  styleUrls: ['./company-management-details.component.scss']
})
export class CompanyManagementDetailsComponent implements OnInit {
  
  edited_company_id: string;
  companyName: string;
  companyState: string;
  companyDistrict: string;
  companyAddress1: string;
  companyLandmark: string;
  companyAddress2: string;
  companyLatitude: string;
  companyLongitude: string;
  companyPincode: string;
  companyEmail: string;
  comapanyPhoneNumber: string;
  status: string;
  googleAddress: string;
  searchname: string;

  constructor(private headerService: HeaderInteractorService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private uTrackService: UtrackService,
    private routes: Router,
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.edited_company_id = params.company_id;
    })
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Company Management Details');
    this.my_company_detail();
  }

  back() {
    this.location.back();
  }
  company_image: any
  my_company_detail() {

    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    formData.append('user_type', localStorage.getItem('USER_TYPE'));
    formData.append('device_token', 'Web');
    formData.append('company_id', this.edited_company_id);
    this.uTrackService.my_company_detail(formData).subscribe(response => {
      if (response.data != undefined && response.data != null) {
        if (response.data.company_logo == "" || response.data.company_logo == undefined || response.data.company_logo == null) {
          this.company_image = "assets/defaultpic.png"
        } else {
          this.company_image = response.data.company_logo
        }
        this.companyName = response.data.company_name
        // this.comapnayUrl = response.data.company_website
        this.companyState = response.data.company_state
        this.companyDistrict = response.data.company_district_name
        this.companyAddress1 = response.data.company_address1
        this.companyLandmark = response.data.company_landmark
        this.companyAddress2 = response.data.company_address2
        this.companyLatitude = response.data.company_latitude
        this.companyLongitude = response.data.company_longitude
        this.companyPincode = response.data.company_pincode
        this.companyEmail = response.data.company_email
        this.comapanyPhoneNumber = response.data.company_mobile
        this.status = response.data.status
        this.googleAddress = response.data.company_google_address;
        this.searchname = response.data.company_google_address
      }
    })
  }
  editCompany() {
    this.routes.navigate([`./edit-company`, this.edited_company_id],
      { relativeTo: this.activatedRoute });
  }

}
