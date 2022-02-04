import { Component, OnInit } from '@angular/core';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.scss']
})
export class DriverDetailsComponent implements OnInit {

  driverId: string;
  driverImage: string;
  nickName: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  dateOfBirth: Date;
  dateOfJoin: Date;
  bloodGroup: string;
  gender: string;
  drivingLicenceId: string;
  panId: string;

  constructor(private uTrackService: UtrackService,
    private headerService: HeaderInteractorService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.driverId = params.user_id;
    })
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Driver Details')
    this.editDriver();
  }

  back() {
    this.location.back();
  }

  editDriver() {
    this.uTrackService.driver_detail(this.driverId).subscribe(response => {
      for (let element of response.data) {
        this.driverImage = element.profile_image
        this.nickName = element.nick_name
        this.firstName = element.first_name
        this.lastName = element.last_name
        this.mobileNumber = element.mobile
        this.dateOfBirth = new Date(element.birth_date)
        this.dateOfJoin = new Date(element.joining_date)
        this.bloodGroup = element.blood_group
        this.gender = element.gender
        this.drivingLicenceId = element.driving_licence_id
        this.panId = element.pan_id
      }
    })
  }

}
