import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';

interface Bank {
  id: string;
  name: string;
 }

@Component({
  selector: 'ngx-trip-management',
  templateUrl: './trip-management.component.html',
  styleUrls: ['./trip-management.component.scss']
})
export class TripManagementComponent implements OnInit {

constructor(private uTrackService: UtrackService, private headerService: HeaderInteractorService) { }


 ngOnInit() {

}





}
