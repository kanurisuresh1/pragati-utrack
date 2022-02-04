import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-tyre-management',
  templateUrl: './tyre-management.component.html',
  styleUrls: ['./tyre-management.component.scss']
})
export class TyreManagementComponent implements OnInit {

  constructor(private uTrackService: UtrackService, private headerService: HeaderInteractorService) { }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Tyre Management')

  }

}
