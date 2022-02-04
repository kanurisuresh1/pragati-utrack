import { Component, OnInit } from '@angular/core';
import { MyProfileResponseData, MyProfileResponse } from '../../../../@theme/components/Model/MyProfileResponse';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-my-executive',
  templateUrl: './my-executive.component.html',
  styleUrls: ['./my-executive.component.scss']
})
  
export class MyExecutiveComponent implements OnInit {
  fname: any;
  lname: any;
  email: string;
  mobile: string;
  state: string;
  district: any;
  city: any;
  zipcode: any;
  Address: any;
  previewUrl: any

  userData: MyProfileResponseData;

  constructor(private headerService: HeaderInteractorService, private routes: Router,
    private http: HttpClient, private location: Location,private uTrackService:UtrackService) {
     }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.My Executive Details')
    this.getMyProfileData();
  }

  myProfileForm = new FormGroup({
    firstname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    state: new FormControl('', [Validators.required]),
    district: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    mobile: new FormControl('', [Validators.required]),
    zipcode: new FormControl('', [Validators.required, Validators.minLength(6)]),
    Address: new FormControl('', [Validators.required]),

  })


  back() {
    this.location.back();
  }
  
  getMyProfileData() {
    const params = new HttpParams()
      .set('user_id', localStorage.getItem("REGISTERED_ID"))
      .set('device_token', "Web")
      .set('user_type', localStorage.getItem("USER_TYPE"))
      .set('X-Api-Key', environment.X_API_KEY)

    this.http.get<MyProfileResponse>(environment.apiBaseUrl + 'my_profile', { params }).subscribe(response => {
      if (response.status) {
        this.userData = response.data[0];
        this.fname = this.userData.first_name
        this.lname = this.userData.last_name
        this.email = this.userData.email
        this.mobile = this.userData.mobile
        this.state = this.userData.state
        this.district = this.userData.district_name
        this.city = this.userData.city
        this.zipcode = this.userData.zipcode
        this.Address = this.userData.address1
        this.previewUrl = this.userData.profile_image
      }
      else {
        alert(response.message);
      }
    })
  }

}
