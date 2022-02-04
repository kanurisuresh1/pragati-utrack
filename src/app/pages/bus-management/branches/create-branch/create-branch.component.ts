import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BusOrganisationBranchListResponseData } from '../../../../@theme/components/Model/BusOrganisationBranchListResponse';
import { BusOrganisationsListResponseData } from '../../../../@theme/components/Model/BusOrganisationsListResponse';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';


interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

@Component({
  selector: 'ngx-create-branch',
  templateUrl: './create-branch.component.html',
  styleUrls: ['./create-branch.component.scss']
})
export class CreateBranchComponent implements OnInit {

  constructor(
    private uTrackService: UtrackService,
    private toasterService: NbToastrService,
    private headerService: HeaderInteractorService,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.bus_organisation_branch_id = params.bus_organisation_branch_id;
    });
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();

    if (this.bus_organisation_branch_id == undefined || this.bus_organisation_branch_id == null
      || this.bus_organisation_branch_id == '') {
      this.headerService.updateHeaderTitle('Create Branch');
      this.isCreateBranchOrganisation = true;
      this.bus_organisation_list();
    } else {
      this.headerService.updateHeaderTitle('Edit Branch');
      this.isCreateBranchOrganisation = false;
      this.bus_organisation_branch_detail();
      this.bus_organisation_list();
    }

    this.initMap();
  }

  zoom: number = 8;

  // initial center position for the map
  lat: number = 17.3850;
  lng: number = 78.4867;

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  markers: marker[] = []

  isCreateBranchOrganisation: boolean = true;
  bus_organisation_branch_id: string;
  statusType: string = 'Active';
  branch_name: string;
  branchLocation: string;

  latitude: any;
  longitude: any;
  searchElemant: any;
  autocomplete: google.maps.places.Autocomplete;
  searchname: string;

  organisation_list: BusOrganisationsListResponseData[] = [];
  org_name: string;

  branchForm = new FormGroup({
    bus_organisation_id: new FormControl('', [Validators.required]),
    branch_name: new FormControl('', [Validators.required]),
    branch_location: new FormControl('', [Validators.required]),
    google_location: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
  })

  initMap() {
    this.searchElemant = document.getElementById("map_on_search");
    this.autocomplete = new google.maps.places.Autocomplete(this.searchElemant);
    this.autocomplete.setFields(
      ['geometry', 'icon', 'name', 'formatted_address']);
    this.autocomplete.addListener("place_changed", () => {
      var place = this.autocomplete.getPlace();
      this.searchname = place.formatted_address
      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();

      this.lat = this.latitude;
      this.lng = this.longitude;
      this.markers = [];
      this.markers.push({
        lat: this.latitude,
        lng: this.longitude,
        label: this.searchname,
        draggable: true
      })

    });
  }

  back() {
    this.location.back();
  }

  bus_organisation_branch_detail() {

    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    formData.append('bus_organisation_branch_id', this.bus_organisation_branch_id);

    this.uTrackService.bus_organisation_branch_detail(formData).subscribe(response => {
      if (response.status) {
        if (response.data != null && response.data != undefined) {
          let BUS_ORGANISATION_BRANCH_DATA = response.data;
          this.org_name = BUS_ORGANISATION_BRANCH_DATA.bus_organisation_id;
          this.branch_name = BUS_ORGANISATION_BRANCH_DATA.branch_name;
          this.branchLocation = BUS_ORGANISATION_BRANCH_DATA.branch_location
          this.statusType = BUS_ORGANISATION_BRANCH_DATA.status;
          this.searchname = BUS_ORGANISATION_BRANCH_DATA.google_location;
          this.latitude = BUS_ORGANISATION_BRANCH_DATA.latitude;
          this.longitude = BUS_ORGANISATION_BRANCH_DATA.longitude;
          this.lat = this.latitude;
          this.lng = this.longitude;
          this.markers = [];
          this.markers.push({
            lat: this.latitude,
            lng: this.longitude,
            label: this.searchname,
            draggable: true
          })
        } else {
          this.org_name = '';
          this.branch_name = '';
          this.branchLocation = ''
          this.statusType = '';
          this.searchname = '';
          this.latitude = '';
          this.longitude = '';
        }
      }
    })
  }

  bus_organisation_list() {

    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));

    this.uTrackService.bus_organisation_list(formData).subscribe(response => {
      if (response.status) {
        if (response.data != null && response.data != undefined && response.data.length > 0) {
          this.organisation_list = response.data;
          if (this.bus_organisation_branch_id == undefined || this.bus_organisation_branch_id == null || this.bus_organisation_branch_id == '') {
            this.org_name = this.organisation_list[0].bus_organisation_id
          }
        }
      }
    })
  }

  changeOrg(row) {
    this.branchForm.value.bus_organisation_id = row.bus_organisation_id;
  }

  createOrg() {
    let bus_organisation_id = this.branchForm.value.bus_organisation_id;
    let branch_name = this.branchForm.value.branch_name;
    let branch_location = this.branchForm.value.branch_location;
    let searchname = this.searchname;
    let status = this.branchForm.value.status;

    if (bus_organisation_id != null && bus_organisation_id != undefined && bus_organisation_id != ''
      && branch_name != null && branch_name != undefined && branch_name != ''
      && branch_location != null && branch_location != undefined && branch_location != ''
      && searchname != null && searchname != undefined && searchname != ''
      && status != null && status != undefined && status != '') {

      if (this.isCreateBranchOrganisation) {
        const formData = new FormData();
        formData.append('user_id', localStorage.getItem('USER_ID'));
        formData.append('device_token', "Web");
        formData.append('user_type', localStorage.getItem('USER_TYPE'));
        formData.append('bus_organisation_id', bus_organisation_id);
        formData.append('branch_name', branch_name);
        formData.append('branch_location', branch_location);
        formData.append('google_location', searchname);
        formData.append('latitude', this.latitude);
        formData.append('longitude', this.longitude);
        formData.append('status', status);

        this.uTrackService.bus_organisation_branch_create(formData).subscribe(response => {
          if (response.status) {
            this.toasterService.success('Pragati Utrack', response.message);
            this.location.back();
          } else {
            this.toasterService.danger('Pragati Utrack', response.message);

          }
        })
      } else {
        const formData = new FormData();
        formData.append('user_id', localStorage.getItem('USER_ID'));
        formData.append('device_token', "Web");
        formData.append('user_type', localStorage.getItem('USER_TYPE'));
        formData.append('bus_organisation_id', bus_organisation_id);
        formData.append('branch_name', branch_name);
        formData.append('branch_location', branch_location);
        formData.append('google_location', searchname);
        formData.append('latitude', this.latitude);
        formData.append('longitude', this.longitude);
        formData.append('status', status);
        formData.append('bus_organisation_branch_id', this.bus_organisation_branch_id);

        this.uTrackService.bus_organisation_branch_update(formData).subscribe(response => {
          if (response.status) {
            this.toasterService.success('Pragati Utrack', response.message);
            this.location.back();
          } else {
            this.toasterService.danger('Pragati Utrack', response.message);

          }
        })
      }

    } else {
      this.toasterService.danger('Pragati Utrack', 'Please Fill All Mandatory Fields')
    }

  }

}