import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-route-details',
  templateUrl: './route-details.component.html',
  styleUrls: ['./route-details.component.scss']
})
export class RouteDetailsComponent implements OnInit {
  route_name: string;
  start_location: string;
  end_location: string;
  distance: string;
  travel_time_mins: string;

  constructor(private headerService: HeaderInteractorService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private uTrackService: UtrackService) {
    this.activatedRoute.params.subscribe(params => {
      this.route_name = params.route_name;
      this.start_location = params.start_location;
      this.end_location = params.end_location;
      this.distance = params.distance;
      this.travel_time_mins = params.travel_time_mins;
    })
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Route Details');
  }

  back() {
    this.location.back();
  }

}
