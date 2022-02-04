import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { BusTimilngListResponseData } from '../../../../@theme/components/Model/BusTimilngListResponse';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-bus-timing-details',
  templateUrl: './bus-timing-details.component.html',
  styleUrls: ['./bus-timing-details.component.scss']
})
export class BusTimingDetailsComponent implements OnInit {

  constructor(
    private uTrackService: UtrackService,
    private toasterService: NbToastrService,
    private headerService: HeaderInteractorService,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.bus_route_timing_id = params.bus_route_timing_id;
    });
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.headerService.updateHeaderTitle('Timing Details');
    this.get_timing_details();
  }
  bus_route_timing_id: string;

  back() {
    this.location.back();
  }

  timingDetails: BusTimilngListResponseData;
  branch_name: string = ''
  org_name: string = ''
  route_name: string = ''
  trip_end_time: string = ''
  trip_start_time: string = ''
  trip_type: string = ''

  get_timing_details() {
    this.timingDetails = {} as BusTimilngListResponseData;
    this.timingDetails = JSON.parse(localStorage.getItem("TIMING_DETAILS"))
    this.org_name = this.timingDetails.org_name;
    this.branch_name = this.timingDetails.branch_name;
    this.route_name = this.timingDetails.route_name;
    this.trip_end_time = this.timingDetails.trip_end_time;
    this.trip_start_time = this.timingDetails.trip_start_time;
    this.trip_type = this.timingDetails.trip_type;
  }
}
