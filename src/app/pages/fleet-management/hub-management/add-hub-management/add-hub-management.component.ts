import { Component, OnInit } from '@angular/core';
import {  Location } from '@angular/common';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import { NbToastrService } from '@nebular/theme';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-add-hub-management',
  templateUrl: './add-hub-management.component.html',
  styleUrls: ['./add-hub-management.component.scss']
})
export class AddHubManagementComponent implements OnInit {
  states = [];
  districts = [];
  cities = [];
  hubId: string;
  isSubmit: boolean;

  todayDate = new Date()
  //Edit Data Binding
  nickName: string
  firstName: string
  lastName: string
  mobileNumber: string
  dateOfBirth: Date
  dateOfJoin: Date
  bloodGroup: string
  gender: string
  drivingLicenceId: string
  panId: string
  stateId: string
  districtId: string
  cityId: string
  pincode: string
  area: string
  landmark: string
  address: string
  driver_image: string | ArrayBuffer
  profileImageUpload: File = null;
  //Binding Hud Edit Values
  hubName: string;
  hubLocation: string;
  hubManager: string;
  hubManagerNum: string;
  hubState: string
  hubDistrict: string

  constructor(private uTrackService: UtrackService,
    private location: Location,
     private toasterService: NbToastrService,
    private headerService: HeaderInteractorService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.hubId = params.hub_id;
    });

  }

  AddHubRegistrationForm = new FormGroup({
    fctrl_hubname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    fctrl_hub_location: new FormControl('', [Validators.required, Validators.minLength(1)]),
    fctrl_hub_manager: new FormControl(''),
    fctrl_hub_manager_number: new FormControl(''),
    fctrl_state: new FormControl('', [Validators.required]),
    fctrl_district: new FormControl('', [Validators.required]),
  })

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    if (this.hubId === undefined) {
      this.headerService.updateHeaderTitle('HEADER_NAMES.Add Hub')
      this.isSubmit = true;
    } else {
      this.headerService.updateHeaderTitle('HEADER_NAMES.Edit Hub')
      this.isSubmit = false;
      this.editHub();
    }
    this.getStateList();
    this.initMap()
  }

  back() {
    this.location.back();
  }

  onStateChange(e) {
    this.districts = []
    this.getDistricts();
  }

  latitude: any;
  longitude: any;
  searchElemant: any;
  autocomplete: google.maps.places.Autocomplete;
  addressName: string;
  searchname: string;

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
    });
  }

  getStateList() {
    this.uTrackService.getStates().subscribe(response => {
      if (response.status) {
        this.states = response.data;
        this.getDistricts();
      }
    })
  }

  getDistricts() {
    this.uTrackService.getDistricts(this.AddHubRegistrationForm.value.fctrl_state).subscribe(response => {
      if (response.status) {
        this.districts = response.data
      } else {
      }
    })
  }

  addHub() {
    if (localStorage.getItem("MOBILE") == "9966663333") {
      this.toasterService.danger("Please login with your credentials to proceed, This is demo account.")
    } else {
      if (this.AddHubRegistrationForm.value.fctrl_hubname != "" && this.AddHubRegistrationForm.value.fctrl_hubname !== undefined
        && this.AddHubRegistrationForm.value.fctrl_hub_location != "" && this.AddHubRegistrationForm.value.fctrl_hub_location !== undefined
        && this.AddHubRegistrationForm.value.fctrl_state != "" && this.AddHubRegistrationForm.value.fctrl_state !== undefined
        && this.AddHubRegistrationForm.value.fctrl_district != "" && this.AddHubRegistrationForm.value.fctrl_district !== undefined) {
        if (this.hubId == undefined) {
          const formData = new FormData();
          formData.append('user_id', localStorage.getItem('USER_ID'));
          formData.append('user_type', localStorage.getItem("USER_TYPE"));
          formData.append('device_token', "Web");
          formData.append('hub_name', this.AddHubRegistrationForm.value.fctrl_hubname);
          formData.append('hub_location', this.searchname);
          formData.append('latitude', this.latitude);
          formData.append('longitude',this.longitude);
          formData.append('state_id', this.AddHubRegistrationForm.value.fctrl_state);
          formData.append('district_id', this.AddHubRegistrationForm.value.fctrl_district);
          formData.append('manager_name', this.AddHubRegistrationForm.value.fctrl_hub_manager);
          formData.append('manager_number', this.AddHubRegistrationForm.value.fctrl_hub_manager_number);

          this.uTrackService.hub_create(formData).subscribe(response => {
            if (response.status) {
              this.toasterService.success('', response.message)
              this.location.back();
            } else {
              this.toasterService.danger('', response.message)
            }
          })
        } else {
          const formData = new FormData();
          formData.append('user_id', localStorage.getItem('USER_ID'));
          formData.append('user_type', localStorage.getItem("USER_TYPE"));
          formData.append('device_token', "Web");
          formData.append('hub_name', this.AddHubRegistrationForm.value.fctrl_hubname);
          formData.append('hub_location', this.searchname);
          formData.append('latitude', this.latitude);
          formData.append('longitude',this.longitude);
          formData.append('state_id', this.AddHubRegistrationForm.value.fctrl_state);
          formData.append('district_id', this.AddHubRegistrationForm.value.fctrl_district);
          formData.append('manager_name', this.AddHubRegistrationForm.value.fctrl_hub_manager);
          formData.append('manager_number', this.AddHubRegistrationForm.value.fctrl_hub_manager_number);
          formData.append('hub_id', this.hubId);

          this.uTrackService.hub_edit(formData).subscribe(response => {
            if (response.status) {
              this.toasterService.success('', response.message)
              this.location.back();
            } else {
              this.toasterService.danger('', response.message)
            }
          })
        }
      } else {
        this.toasterService.danger("Please fill all mandatory Information.");
      }
    }

  }


  editHub() {
      const formData = new FormData();
      formData.append('user_id', localStorage.getItem('USER_ID'));
      formData.append('user_type', localStorage.getItem('USER_TYPE'));
      formData.append('device_token', localStorage.getItem('Web'));
      formData.append('hub_id', this.hubId);
      this.uTrackService.hub_detail(formData).subscribe(response => {
        if (response.data != undefined && response.data != null && response.data.length > 0) {
          response.data.forEach(element => {
            this.hubName = element.hub_name
            this.hubLocation = element.hub_location
            this.hubManager = element.manager_name
            this.hubManagerNum = element.manager_number
            this.hubState = element.state_id
            this.hubDistrict = element.district_id
          })
        }
      })
  }

}
