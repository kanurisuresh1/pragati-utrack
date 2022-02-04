import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-spare-part-management',
  templateUrl: './spare-part-management.component.html',
  styleUrls: ['./spare-part-management.component.scss']
})
export class SparePartManagementComponent implements OnInit {

  constructor(private uTrackService: UtrackService, private headerService: HeaderInteractorService) { }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Spare Part Management')

  }

}
