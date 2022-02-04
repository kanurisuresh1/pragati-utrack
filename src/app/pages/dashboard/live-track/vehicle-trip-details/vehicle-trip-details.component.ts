import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-vehicle-trip-details',
  templateUrl: './vehicle-trip-details.component.html',
  styleUrls: ['./vehicle-trip-details.component.scss']
})
export class VehicleTripDetailsComponent implements OnInit {

  constructor(private translate:TranslateService,private uTrackService:UtrackService) { 
 
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
  }

}
