import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NbToastrService } from '@nebular/theme';
import { BusGeofenceListResponseData } from '../../../../@theme/components/Model/BusGeofenceListResponse';
import { BusOrganisationBranchListResponseData } from '../../../../@theme/components/Model/BusOrganisationBranchListResponse';
import { BusOrganisationsListResponseData } from '../../../../@theme/components/Model/BusOrganisationsListResponse';
import { BusRouteListResponseData } from '../../../../@theme/components/Model/BusRouteListResponse';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-create-bus-route',
  templateUrl: './create-bus-route.component.html',
  styleUrls: ['./create-bus-route.component.scss']
})
export class CreateBusRouteComponent implements OnInit {

  private routeData: BusRouteListResponseData
  isCreateRoute: boolean = false;

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
    @Inject(MAT_DIALOG_DATA) busRouteData: BusRouteListResponseData,
  ) {
    if (busRouteData != null && busRouteData != undefined)
      this.routeData = JSON.parse(busRouteData.bus_route_id);
  }

  routeName: string = '';
  bus_route_id: string = '';


  ngOnInit(): void {

    if (this.routeData != undefined && this.routeData != null) {
      this.isCreateRoute = false;
      this.bus_route_id = this.routeData.bus_route_id;
      this.routeName = this.routeData.route_name;
      this.from_geofence_id = this.routeData.from_geofence_id;
      this.to_geofence_id = this.routeData.to_geofence_id;
      this.org_name = this.routeData.bus_organisation_id;
      this.branch_org_name = this.routeData.bus_organisation_id;

      this.bus_geofence_list();
      this.bus_organisation_list();
      this.bus_organisation_branch_list();
    } else {
      this.isCreateRoute = true;
      this.bus_geofence_list();
      this.bus_organisation_list();
      this.bus_organisation_branch_list();
    }
  }

  busRouteForm = new FormGroup({
    route_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    from_geofence_id: new FormControl('', [Validators.required,]),
    to_geofence_id: new FormControl('', [Validators.required,]),
    bus_organisation_id: new FormControl('', [Validators.required]),
    bus_organisation_branch_id: new FormControl('', [Validators.required]),
  })



  bus_geofence_list() {
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    this.uTrackService.bus_geofence_list(formData).subscribe(response => {
      this.geofence_list = [];
      if (response.status) {
        if (response.data != null && response.data != undefined && response.data.length > 0) {
          this.geofence_list = response.data;
          if (this.routeData == undefined && this.routeData == null) {
            this.from_geofence_id = this.geofence_list[0].geofence_id;
            this.to_geofence_id = this.geofence_list[0].geofence_id;
          }
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
    this.busRouteForm.value.bus_organisation_id = row.bus_organisation_id;
  }

  changeBranchOrg(row) {
    this.busRouteForm.value.bus_organisation_branch_id = row.bus_organisation_branch_id;
  }

  fromChangeGeofence(row) {
    this.busRouteForm.value.from_geofence_id = row.geofence_id;
  }

  toChangeGeofence(row) {
    this.busRouteForm.value.to_geofence_id = row.geofence_id;
  }

  createRoute() {
    let route_name = this.busRouteForm.value.route_name;
    let from_geofence_id = this.busRouteForm.value.from_geofence_id;
    let to_geofence_id = this.busRouteForm.value.to_geofence_id;
    let bus_organisation_id = this.busRouteForm.value.bus_organisation_id;
    let bus_organisation_branch_id = this.busRouteForm.value.bus_organisation_branch_id;

    if (route_name != null && route_name != undefined && route_name != '' && route_name.length >= 3) {
      if (this.isCreateRoute) {
        const formData = new FormData();
        formData.append('user_id', localStorage.getItem('USER_ID'));
        formData.append('route_name', route_name);
        formData.append('from_geofence_id', from_geofence_id);
        formData.append('to_geofence_id', to_geofence_id);
        formData.append('bus_organisation_id', bus_organisation_id);
        formData.append('bus_organisation_branch_id', bus_organisation_branch_id);

        this.uTrackService.bus_route_create(formData).subscribe(response => {
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
        formData.append('route_name', route_name);
        formData.append('from_geofence_id', from_geofence_id);
        formData.append('to_geofence_id', to_geofence_id);
        formData.append('bus_organisation_id', bus_organisation_id);
        formData.append('bus_organisation_branch_id', bus_organisation_branch_id);
        formData.append('bus_route_id', this.bus_route_id);

        this.uTrackService.bus_route_edit(formData).subscribe(response => {
          if (response.status) {
            this.toasterService.success("Pragati Utrack", response.message);
            this.dialogRef.close();
          } else {
            this.toasterService.danger("Pragati Utrack", response.message)
          }
        })
      }
    } else {
      this.toasterService.danger('Pragati Utrack', 'Enter Route Name')
    }
  }
}
