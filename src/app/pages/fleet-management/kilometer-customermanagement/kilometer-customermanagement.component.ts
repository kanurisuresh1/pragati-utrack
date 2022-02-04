import { Component, OnInit } from '@angular/core';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-kilometer-customermanagement',
  templateUrl: './kilometer-customermanagement.component.html',
  styleUrls: ['./kilometer-customermanagement.component.scss']
})
export class KilometerCustomermanagementComponent implements OnInit {

  constructor(private uTrackService: UtrackService) { }

  ngOnInit(): void {
    this.uTrackService.isUserValid();

  }

}
