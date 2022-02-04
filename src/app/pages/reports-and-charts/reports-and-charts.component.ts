import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../@theme/components/Services/header-interactor.service';
import { NbToastrService } from '@nebular/theme';
import { UtrackService } from '../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-reports-and-charts',
  templateUrl: './reports-and-charts.component.html',
  styleUrls: ['./reports-and-charts.component.scss'],
})
export class ReportsAndChartsComponent implements OnInit {

  constructor(private headerService: HeaderInteractorService,
    private toasterService: NbToastrService, private uTrackService: UtrackService,
   ) {
  
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Reports And Charts');
  }
  comingSoon() {
    this.toasterService.info('', 'This feature is coming soon');
  }
}
