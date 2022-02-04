import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { HeaderInteractorService } from '../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-alert-and-notifications',
  templateUrl: './alert-and-notifications.component.html',
  styleUrls: ['./alert-and-notifications.component.scss']
})
export class AlertAndNotificationsComponent implements OnInit {

  constructor(private headerService: HeaderInteractorService,
    private taoster: NbToastrService,
    private uTrackService:UtrackService) { }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Alerts And Notifications')
  }

  comingsoon() {
    this.taoster.info('', 'This feature is coming soon...!')
  }
}
