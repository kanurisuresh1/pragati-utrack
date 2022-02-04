import { Component, OnInit } from '@angular/core';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-expanses-management',
  templateUrl: './expanses-management.component.html',
  styleUrls: ['./expanses-management.component.scss']
})
export class ExpansesManagementComponent implements OnInit {

  constructor(private uTrackService: UtrackService) { }

  ngOnInit(): void {
    this.uTrackService.isUserValid();

  }

}
