import { Component, OnInit } from '@angular/core';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { Location } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { DatePipe } from '@angular/common';
import { HttpParams, HttpClient } from '@angular/common/http';
import { TripCreateResponse } from '../../../../@theme/components/Model/TripCreateResponse';
import { RouteListResponse } from '../../../../@theme/components/Model/RouteListResponse';
import { MyUsersListResponse } from '../../../../@theme/components/Model/MyUsersListResponse';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { HomeLiteV1Data } from '../../../../@theme/components/Model/HomeLiteV1Response';
import { DateUtils } from '../../../../@theme/components/Services/date_utils';
import { TranslateService } from '@ngx-translate/core';
export const MY_FORMATS = {
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },

};

@Component({
  selector: 'ngx-create-trip',
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],

})
export class CreateTripComponent implements OnInit {

  todayDate: Date = new Date();
  yesterDay = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));

  deviceLinkId: any;
  UserId: any;
  selectedObject: any;
  RouteId: string;
  startlocation: any;
  startlatitude: any;
  startlongtitude: any;
  startStationId: any;
  endlocation: any;
  endStationId: any;
  endlatitude: any;
  endlongtitude: any;

  constructor(
    private headerService: HeaderInteractorService, private http: HttpClient,
     private apiService: UtrackService, private toasterService: NbToastrService, private location: Location,
    private uTrackService:UtrackService
  ) {
   
   }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Create Trip')
    this.getVehicles();
    this.getMyUserList();
    this.getRouteList();
  }

  vehicles: HomeLiteV1Data[] = []

  getVehicles() {
    this.apiService.home_lite_v1().subscribe(response => {
      this.vehicles = response.data
      this.deviceLinkId = this.vehicles[0].device_link_id;
    })
  }

  MyUserList = []

  getMyUserList() {
    const params = new HttpParams()
      .set('user_id', localStorage.getItem("USER_ID"))
      .set('user_type', localStorage.getItem("USER_TYPE"))
      .set('device_token', "Web")
      .set('X-Api-Key', environment.X_API_KEY)
    this.http.get<MyUsersListResponse>(environment.apiBaseUrl + 'my_users_list', { params }).subscribe(response => {
      if (response.status) {
        this.MyUserList = response.data
        this.UserId = this.MyUserList[0].user_id;
      }
    })
  }

  RouteListData = []

  getRouteList() {
    const params = new HttpParams()
      .set('user_id', localStorage.getItem("USER_ID"))
      .set('device_token', "Web")
      .set('X-Api-Key', environment.X_API_KEY)
    this.http.get<RouteListResponse>(environment.apiBaseUrl + 'route_list', { params }).subscribe(response => {
      if (response.status) {
        this.RouteListData = response.data
        this.RouteId = response.data[0].route_id
      }
    })
  }

  back() {
    this.location.back()
  }

  createtrip = new FormGroup({

    selectvehicle: new FormControl('', [Validators.required]),
    selectdriver: new FormControl('', [Validators.required]),
    tripname: new FormControl('', [Validators.required]),
    tripnotes: new FormControl('', [Validators.required]),
    startdate: new FormControl(this.yesterDay),
    enddate: new FormControl(this.todayDate),
    routename: new FormControl('', [Validators.required]),

  })


  updateSelectedValue(event) {
    this.selectedObject = JSON.parse(event);

    this.startlocation = this.selectedObject.start_location
    this.startlatitude = this.selectedObject.start_lat
    this.startlongtitude = this.selectedObject.start_lon
    this.startStationId = this.selectedObject.start_station_id
    this.endlocation = this.selectedObject.end_location
    this.endStationId = this.selectedObject.end_station_id
    this.endlatitude = this.selectedObject.end_lat
    this.endlongtitude = this.selectedObject.end_lon

  }


  submit() {

    if (localStorage.getItem("MOBILE") == "9966663333") {
      this.toasterService.danger("Please login with your credentials to proceed, This is demo account.")
    } else {
      const headers = {
        'X-Api-Key': environment.X_API_KEY,
      }
      const formData = new FormData();

      formData.append('user_id', localStorage.getItem("USER_ID"));
      formData.append('user_type', "Customer");
      formData.append('device_token', "Web");
      formData.append('trip_name', this.createtrip.value.tripname);
      formData.append('trip_notes', this.createtrip.value.tripnotes);
      formData.append('device_link_id', this.createtrip.value.selectvehicle);
      formData.append('driver_id', '');
      formData.append('start_location', this.startlocation);
      formData.append('start_lat', this.startlatitude);
      formData.append('start_lon', this.startlongtitude);
      formData.append('start_station_id', this.startStationId);
      formData.append('end_location', this.endlocation);
      formData.append('end_station_id', this.endStationId);
      formData.append('end_lat', this.endlatitude);
      formData.append('end_lon', this.endlongtitude);
      formData.append('customer_id', '');
      formData.append('trip_stops_json', '');
      formData.append('start_date_time', DateUtils.getServerDateTimeHoursMins(this.createtrip.value.startDate));
      formData.append('end_date_time', DateUtils.getServerDateTimeHoursMins(this.createtrip.value.enddate));

      this.http.post<TripCreateResponse>(environment.apiBaseUrl + 'trip_create', formData, { headers }).subscribe(response => {
        if (response.status) {
          this.toasterService.success('Pragati Utrack', response.message)
          this.location.back();
        } else {
          this.toasterService.danger('Pragati Utrack', response.message)
        }
      })

    }


  }

}
