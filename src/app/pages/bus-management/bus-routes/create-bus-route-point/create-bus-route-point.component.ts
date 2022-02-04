import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NbToastrService } from '@nebular/theme';
import { BusGeofenceListResponseData } from '../../../../@theme/components/Model/BusGeofenceListResponse';
import { PickupDropPoint } from '../../../../@theme/components/Model/BusRouteDetailsListResponse';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-create-bus-route-point',
  templateUrl: './create-bus-route-point.component.html',
  styleUrls: ['./create-bus-route-point.component.scss']
})
export class CreateBusRoutePointComponent implements OnInit {

  constructor(private uTrackService: UtrackService,
    private toasterService: NbToastrService,
    public dialogRef: MatDialogRef<CreateBusRoutePointComponent>,
    @Inject(MAT_DIALOG_DATA) busRoutePointData: PickupDropPoint,
  ) {
    if (busRoutePointData != null && busRoutePointData != undefined)
      this.routePointData = JSON.parse(busRoutePointData.bus_point_id);
  }

  ngOnInit(): void {
    if (this.routePointData != undefined && this.routePointData != null) {
      this.isCreateRoute = false;
      this.bus_route_id = this.routePointData.bus_route_id;
      this.bus_point_id = this.routePointData.bus_point_id;
      this.point_type = this.routePointData.point_type;
      this.previous_location_duration_mins = this.routePointData.previous_location_duration_mins;
      this.geofence_id = this.routePointData.geofence_id;
      this.sequence = this.routePointData.sequence;
      this.bus_geofence_list();
    } else {
      this.isCreateRoute = true;
      this.point_type = 'Pickup';
      this.previous_location_duration_mins = '';
      this.sequence = '';
      this.bus_geofence_list();
    }
  }

  routePointData: PickupDropPoint
  isCreateRoute: boolean = false;
  bus_point_id: string;
  bus_route_id: string;
  point_type = 'Pickup';
  previous_location_duration_mins: string;
  sequence: string;

  geofence_list: BusGeofenceListResponseData[] = [];
  geofence_id: string = '';

  busRoutePointForm = new FormGroup({
    geofence_id: new FormControl('', [Validators.required,]),
    point_type: new FormControl('', [Validators.required,]),
    previous_location_duration_mins: new FormControl('', [Validators.required]),
    sequence: new FormControl('', [Validators.required]),
  })

  bus_geofence_list() {
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    this.uTrackService.bus_geofence_list(formData).subscribe(response => {
      this.geofence_list = [];
      if (response.status) {
        if (response.data != null && response.data != undefined && response.data.length > 0) {
          this.geofence_list = response.data;
          if (this.routePointData == undefined && this.routePointData == null) {
            this.geofence_id = this.geofence_list[0].geofence_id;
          }
        }
      }
    })
  }

  fromChangeGeofence(row) {
    this.busRoutePointForm.value.geofence_id = row.geofence_id;
  }


  createRoute() {
    let geofence_id = this.busRoutePointForm.value.geofence_id;
    let point_type = this.busRoutePointForm.value.point_type;
    let previous_location_duration_mins = this.busRoutePointForm.value.previous_location_duration_mins;
    let sequence = this.busRoutePointForm.value.sequence;
    this.bus_route_id = localStorage.getItem('BUS_ROUTE_ID')

    if (geofence_id != null && geofence_id != undefined && geofence_id != ''
      && point_type != null && point_type != undefined && point_type != ''
      && previous_location_duration_mins != null && previous_location_duration_mins != undefined && previous_location_duration_mins != ''
      && sequence != null && sequence != undefined && sequence != '') {
      if (this.isCreateRoute) {
        const formData = new FormData();
        formData.append('user_id', localStorage.getItem('USER_ID'));
        formData.append('bus_route_id', this.bus_route_id);
        formData.append('geofence_id', geofence_id);
        formData.append('point_type', point_type);
        formData.append('previous_location_duration_mins', previous_location_duration_mins);
        formData.append('sequence', sequence);

        this.uTrackService.bus_route_point_create(formData).subscribe(response => {
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
        formData.append('bus_route_id', this.bus_route_id);
        formData.append('geofence_id', geofence_id);
        formData.append('point_type', point_type);
        formData.append('previous_location_duration_mins', previous_location_duration_mins);
        formData.append('sequence', sequence);
        formData.append('bus_point_id', this.bus_point_id);

        this.uTrackService.bus_route_point_update(formData).subscribe(response => {
          if (response.status) {
            this.toasterService.success("Pragati Utrack", response.message);
            this.dialogRef.close();
          } else {
            this.toasterService.danger("Pragati Utrack", response.message)
          }
        })
      }
    } else {
      this.toasterService.danger('Pragati Utrack', 'Enter All Mandatory Fields')
    }
  }
}
