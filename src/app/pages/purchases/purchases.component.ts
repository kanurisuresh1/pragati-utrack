import { Component, OnInit } from '@angular/core';
import { UtrackService } from '../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent implements OnInit {

  constructor(private uTrackService: UtrackService) { }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
  }

}
