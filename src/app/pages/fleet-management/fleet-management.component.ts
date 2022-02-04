import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../@theme/components/Services/header-interactor.service';
import { NbToastrService } from '@nebular/theme';
import { UtrackService } from '../../@theme/components/Services/Utrack.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-fleet-management',
  templateUrl: './fleet-management.component.html',
  styleUrls: ['./fleet-management.component.scss']
})
export class FleetManagementComponent implements OnInit {

  constructor(private headerService: HeaderInteractorService,
    private uTrackService: UtrackService,
     private toasterService: NbToastrService,
     ) {
     
      }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
   
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Fleet Management')
  }

  comingSoon() {
    this.toasterService.info('', 'This feature is coming soon')
  }
}
