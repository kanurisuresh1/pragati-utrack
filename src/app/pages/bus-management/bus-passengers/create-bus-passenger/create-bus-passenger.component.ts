import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NbToastrService } from '@nebular/theme';
import { BusGeofenceListResponseData } from '../../../../@theme/components/Model/BusGeofenceListResponse';
import { BusOrganisationBranchListResponseData } from '../../../../@theme/components/Model/BusOrganisationBranchListResponse';
import { BusOrganisationsListResponseData } from '../../../../@theme/components/Model/BusOrganisationsListResponse';
import { BusPassengersListResponseData } from '../../../../@theme/components/Model/BusPassengersListResponse';
import { BusRouteListResponseData } from '../../../../@theme/components/Model/BusRouteListResponse';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import { CreateBusRouteComponent } from '../../bus-routes/create-bus-route/create-bus-route.component';

@Component({
  selector: 'ngx-create-bus-passenger',
  templateUrl: './create-bus-passenger.component.html',
  styleUrls: ['./create-bus-passenger.component.scss']
})
export class CreateBusPassengerComponent implements OnInit {

  private routeData: BusPassengersListResponseData
  isCreatePassenger: boolean = false;

  geofence_list: BusGeofenceListResponseData[] = [];
  to_geofence_id: string = '';
  from_geofence_id: string = '';

  organisation_list: BusOrganisationsListResponseData[] = [];
  org_name: string;

  branch_organisation_list: BusOrganisationBranchListResponseData[] = [];
  branch_org_name: string;

  constructor(private uTrackService: UtrackService,
    private toasterService: NbToastrService,
    public dialogRef: MatDialogRef<CreateBusRouteComponent>,
    @Inject(MAT_DIALOG_DATA) busRouteData: BusPassengersListResponseData,
  ) {
    if (busRouteData != null && busRouteData != undefined)
      this.routeData = JSON.parse(busRouteData.bus_route_id);
  }

  passenger_name: string = '';
  username: string = '';
  email: string = '';
  mobile: string = '';
  bus_route_id: string = '';
  bus_passenger_id: string;

  ngOnInit(): void {

    if (this.routeData != undefined && this.routeData != null) {
      this.isCreatePassenger = false;
      this.bus_passenger_id = this.routeData.bus_passenger_id;
      this.bus_route_id = this.routeData.bus_route_id;
      this.passenger_name = this.routeData.route_name;
      this.username = this.routeData.username;
      this.mobile = this.routeData.mobile;
      this.email = this.routeData.email;
      this.org_name = this.routeData.bus_organisation_id;
      this.branch_org_name = this.routeData.bus_organisation_id;

      this.bus_route_list();
    } else {
      this.isCreatePassenger = true;
      this.bus_route_list();

    }
  }

  busPassengerForm = new FormGroup({
    // bus_route_id: new FormControl('', [Validators.required,]),
    bus_organisation_id: new FormControl('', [Validators.required]),
    bus_organisation_branch_id: new FormControl('', [Validators.required]),
    passenger_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required]),
    mobile: new FormControl('', [Validators.required, Validators.minLength(10)]),

  })

  bus_route_list_data: BusRouteListResponseData[] = [];

  bus_route_list() {
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));

    this.uTrackService.bus_route_list(formData).subscribe(response => {
      if (response.status) {
        if (response.data != null && response.data != undefined && response.data.length > 0) {
          this.bus_route_list_data = response.data;
          this.bus_route_id = this.bus_route_list_data[0].bus_route_id;
          this.bus_organisation_list();
          this.bus_organisation_branch_list();
        }
      }
    })
  }



  bus_organisation_list() {

    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));

    this.uTrackService.bus_organisation_list(formData).subscribe(response => {
      this.organisation_list = [];
      if (response.status) {
        if (response.data != null && response.data != undefined && response.data.length > 0) {
          this.organisation_list = response.data;
          if (this.routeData == undefined && this.routeData == null) {
            this.org_name = this.organisation_list[0].bus_organisation_id
          }
        }
      }
    })
  }


  bus_organisation_branch_list() {

    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    this.uTrackService.bus_organisation_branch_list(formData).subscribe(response => {
      if (response.status) {
        this.branch_organisation_list = [];
        if (response.data != null && response.data != undefined && response.data.length > 0) {
          this.branch_organisation_list = response.data;
          if (this.routeData == undefined && this.routeData == null) {
            this.branch_org_name = this.branch_organisation_list[0].bus_organisation_branch_id
          }
        }
      }
    })
  }

  changeOrg(row) {
    this.busPassengerForm.value.bus_organisation_id = row.bus_organisation_id;
  }

  changeBranchOrg(row) {
    this.busPassengerForm.value.bus_organisation_branch_id = row.bus_organisation_branch_id;
  }


  createRoute() {
    let passenger_name = this.busPassengerForm.value.passenger_name;
    let bus_organisation_id = this.busPassengerForm.value.bus_organisation_id;
    let bus_organisation_branch_id = this.busPassengerForm.value.bus_organisation_branch_id;
    let email = this.busPassengerForm.value.email;
    let username = this.busPassengerForm.value.username;
    let mobile = this.busPassengerForm.value.mobile;

    if (passenger_name != null && passenger_name != undefined && passenger_name != '' && passenger_name.length >= 3
      && email != null && email != undefined && email != ''
      && username != null && username != undefined && username != '' && username.length >= 3
      && mobile != null && mobile != undefined && mobile != '' && mobile.length >= 10) {
      if (this.isCreatePassenger) {
        const formData = new FormData();
        formData.append('user_id', localStorage.getItem('USER_ID'));
        formData.append('bus_organisation_id', bus_organisation_id);
        formData.append('bus_organisation_branch_id', bus_organisation_branch_id);
        formData.append('bus_route_timing_id', '2');
        formData.append('bus_route_id', '1');
        formData.append('bus_trip_id', '1');
        formData.append('passenger_name', passenger_name);
        formData.append('email', email);
        formData.append('username', username);
        formData.append('mobile', mobile);

        this.uTrackService.bus_passenger_create(formData).subscribe(response => {
          if (response.status) {
            this.toasterService.success("Pragati Utrack", response.message);
            this.dialogRef.close();
          } else {
            this.toasterService.danger("Pragati Utrack", response.message)
          }
        })
      } else {
        const formData = new FormData();
        formData.append('user_id', localStorage.getItem('USER_ID'));
        formData.append('bus_organisation_id', bus_organisation_id);
        formData.append('bus_organisation_branch_id', bus_organisation_branch_id);
        formData.append('bus_route_timing_id', '2');
        formData.append('bus_route_id', '1');
        formData.append('bus_trip_id', '1');
        formData.append('passenger_name', passenger_name);
        formData.append('email', email);
        formData.append('username', username);
        formData.append('mobile', mobile);
        formData.append('bus_passenger_id', this.bus_passenger_id);

        this.uTrackService.bus_passenger_edit(formData).subscribe(response => {
          if (response.status) {
            this.toasterService.success("Pragati Utrack", response.message);
            this.dialogRef.close();
          } else {
            this.toasterService.danger("Pragati Utrack", response.message)
          }
        })
      }
    }
  }
}
