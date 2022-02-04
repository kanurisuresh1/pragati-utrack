import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-temperature-dashboard',
  templateUrl: './temperature-dashboard.component.html',
  styleUrls: ['./temperature-dashboard.component.scss']
})
export class TemperatureDashboardComponent implements OnInit {

  constructor(private headerService: HeaderInteractorService, private routes: Router,
    private uTrackService :UtrackService
   ) {
    
     }

  ngOnInit(): void {
    this.headerService.updateHeaderTitle('HEADER_NAMES.Temperature Dashboard');
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
  }

  temperature_alerts() {
    this.routes.navigate(["web/temperature_dashboard/temperature_alerts"]);
  }

  temperature_report() {
    this.routes.navigate(["web/temperature_dashboard/temperature_reports"]);
  }

  temperature_notifications() {
    this.routes.navigate(["web/temperature_dashboard/temperature_notifications"]);
  }

}
