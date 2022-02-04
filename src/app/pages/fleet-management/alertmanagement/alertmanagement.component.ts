import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { Location } from '@angular/common';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'ngx-alertmanagement',
  templateUrl: './alertmanagement.component.html',
  styleUrls: ['./alertmanagement.component.scss']
})
export class AlertmanagementComponent implements OnInit {

  constructor(private headerService: HeaderInteractorService, private location: Location, private uTrackService: UtrackService,
 ) {
    
     }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
  
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Alert Management')
  }


  back() {
    this.location.back();
  }
}
