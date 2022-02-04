import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-full-vechicle-details',
  templateUrl: './full-vechicle-details.component.html',
  styleUrls: ['./full-vechicle-details.component.scss']
})
export class FullVechicleDetailsComponent implements OnInit {
  constructor(private location: Location, private uTrackService: UtrackService) { }
  ngOnInit(): void {
    this.uTrackService.isUserValid();

  }
  back() {
    this.location.back()
  }

}
