import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { BusOrganisationBranchDetailsResponseData } from '../../../../@theme/components/Model/BusOrganisationBranchDetailsResponse';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { UtrackService, } from '../../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-bus-branchdetails',
  templateUrl: './bus-branchdetails.component.html',
  styleUrls: ['./bus-branchdetails.component.scss']
})
export class BusBranchdetailsComponent implements OnInit {

  constructor(
    private uTrackService: UtrackService,
    private toasterService: NbToastrService,
    private headerService: HeaderInteractorService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private routes: Router
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.bus_organisation_branch_id = params.bus_organisation_branch_id;
    });
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.headerService.updateHeaderTitle('Branch Details');
    this.bus_organisation_branch_detail();
  }

  bus_organisation_branch_id: string;
  Bus_Details_Data: BusOrganisationBranchDetailsResponseData;

  branch_name: string
  branch_location: string
  google_location: string
  latitude: string
  longitude: string
  added_date_time: string
  status: string
  org_name: string

  bus_organisation_branch_detail() {
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    formData.append('bus_organisation_branch_id', this.bus_organisation_branch_id);

    this.uTrackService.bus_organisation_branch_detail(formData).subscribe(response => {
      if (response.status) {
        if (response.data != null && response.data != undefined) {
          this.Bus_Details_Data = response.data;
          this.branch_name = this.Bus_Details_Data.branch_name
          this.branch_location = this.Bus_Details_Data.branch_location
          this.google_location = this.Bus_Details_Data.google_location
          this.latitude = this.Bus_Details_Data.latitude
          this.longitude = this.Bus_Details_Data.longitude
          this.added_date_time = this.Bus_Details_Data.added_date_time
          this.status = this.Bus_Details_Data.status
          this.org_name = this.Bus_Details_Data.org_name
        } else {
          this.Bus_Details_Data = {} as BusOrganisationBranchDetailsResponseData;
          this.branch_name = '';
          this.branch_location = '';
          this.google_location = '';
          this.latitude = '';
          this.longitude = '';
          this.added_date_time = '';
          this.status = '';
          this.org_name = '';
        }
      }
    })

  }

  back() {
    this.location.back();
  }

  editBranch() {
    this.routes.navigate([`web/bus_management/branches/edit_branch`, this.bus_organisation_branch_id]);
  }
}
