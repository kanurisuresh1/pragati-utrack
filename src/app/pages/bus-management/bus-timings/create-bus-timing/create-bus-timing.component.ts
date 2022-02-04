import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NbToastrService } from '@nebular/theme';
import { BusRouteListResponseData } from '../../../../@theme/components/Model/BusRouteListResponse';
import { BusTimilngListResponseData } from '../../../../@theme/components/Model/BusTimilngListResponse';
import { DateUtils } from '../../../../@theme/components/Services/date_utils';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-create-bus-timing',
  templateUrl: './create-bus-timing.component.html',
  styleUrls: ['./create-bus-timing.component.scss']
})
export class CreateBusTimingComponent implements OnInit {

  constructor(private uTrackService: UtrackService,
    private toaster: NbToastrService,
    public dialogRef: MatDialogRef<CreateBusTimingComponent>,
    @Inject(MAT_DIALOG_DATA) busTimingRouteData: BusTimilngListResponseData,
  ) {
    if (busTimingRouteData != null && busTimingRouteData != undefined)
      this.timingRouteData = JSON.parse(busTimingRouteData.bus_route_timing_id);
  }

  ngOnInit(): void {
    if (this.timingRouteData != undefined && this.timingRouteData != null) {
      this.isCreateRoute = false;
      this.startDate = new Date(DateUtils.timeToDate(new Date()) + 'T' + this.timingRouteData.trip_start_time);
      this.endtDate = new Date(DateUtils.timeToDate(new Date()) + 'T' + this.timingRouteData.trip_end_time);
      this.trip_type = this.timingRouteData.trip_type;
      this.bus_route_id = this.timingRouteData.bus_route_id;
      this.bus_route_timing_id = this.timingRouteData.bus_route_timing_id;
      this.bus_route_list();
    } else {
      this.isCreateRoute = true;
      this.startDate = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
      this.endtDate = new Date();
      this.trip_type = 'Drop';
      this.bus_route_id = '';
      this.bus_route_list();
    }
  }

  private timingRouteData: BusTimilngListResponseData

  currentDate = new Date();
  startDate = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
  endtDate = new Date();

  route_list: BusRouteListResponseData[] = [];
  bus_route_id: string = '';
  isCreateRoute: boolean = true;
  trip_type: string = 'Drop'
  bus_route_timing_id: string;

  busTimingRouteForm = new FormGroup({
    bus_route_id: new FormControl('', [Validators.required]),
    trip_start_time: new FormControl('', [Validators.required,]),
    trip_end_time: new FormControl('', [Validators.required]),
    trip_type: new FormControl('', [Validators.required]),
  })

  bus_route_list() {
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));

    this.uTrackService.bus_route_list(formData).subscribe(response => {
      this.route_list = [];
      if (response.status) {
        if (response.data != null && response.data != undefined && response.data.length > 0) {
          this.route_list = response.data;
          if (this.timingRouteData == undefined && this.timingRouteData == null) {
            this.bus_route_id = this.route_list[0].bus_route_id;
          }
        }
      }
    })
  }

  routeChange(row) {

  }

  createTimingRoute() {

    if (this.isCreateRoute) {
      const formData = new FormData();
      formData.append('user_id', localStorage.getItem('USER_ID'));
      formData.append('bus_route_id', this.busTimingRouteForm.value.bus_route_id);
      formData.append('trip_start_time', DateUtils.getServerTime(this.busTimingRouteForm.value.trip_start_time));
      formData.append('trip_end_time', DateUtils.getServerTime(this.busTimingRouteForm.value.trip_end_time));
      formData.append('trip_type', this.busTimingRouteForm.value.trip_type);

      this.uTrackService.bus_route_timing_create(formData).subscribe(response => {
        if (response.status) {
          this.toaster.success('Pragati Utrack', response.message);
          this.dialogRef.close();
        } else {
          this.toaster.danger('Pragati Utrack', response.message);
          this.dialogRef.close();
        }
      })
    } else {
      const formData = new FormData();
      formData.append('user_id', localStorage.getItem('USER_ID'));
      formData.append('bus_route_id', this.busTimingRouteForm.value.bus_route_id);
      formData.append('trip_start_time', DateUtils.getServerTime(this.busTimingRouteForm.value.trip_start_time));
      formData.append('trip_end_time', DateUtils.getServerTime(this.busTimingRouteForm.value.trip_end_time));
      formData.append('trip_type', this.busTimingRouteForm.value.trip_type);
      formData.append('bus_route_timing_id', this.bus_route_timing_id);

      this.uTrackService.bus_route_timing_edit(formData).subscribe(response => {
        if (response.status) {
          this.toaster.success('Pragati Utrack', response.message);
          this.dialogRef.close();
        } else {
          this.toaster.danger('Pragati Utrack', response.message);
          this.dialogRef.close();
        }
      })
    }

  }

}
