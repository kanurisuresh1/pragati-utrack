import { Location } from '@angular/common';
import { unescapeIdentifier } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { BusOrganisationBranchListResponseData } from '../../../../@theme/components/Model/BusOrganisationBranchListResponse';
import { BusOrganisationsListResponseData } from '../../../../@theme/components/Model/BusOrganisationsListResponse';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent implements OnInit {

  constructor(
    private uTrackService: UtrackService,
    private toasterService: NbToastrService,
    private location: Location,
    private headerService: HeaderInteractorService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,

  ) {
    this.activatedRoute.params.subscribe(params => {
    });
  }
  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.headerService.updateHeaderTitle('Create Employee')
    this.bus_organisation_list();
    this.bus_organisation_branch_list();
  }

  employeeForm = new FormGroup({
    first_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    last_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    mobile: new FormControl('', [Validators.required, Validators.minLength(10)]),
    bus_organisation_role: new FormControl('', [Validators.required]),
    bus_organisation_id: new FormControl('', [Validators.required]),
    bus_organisation_branch_id: new FormControl('', [Validators.required]),
    fileData: new FormControl('', [Validators.required]),
  })

  back() {
    this.location.back();
  }

  profileImageUpload: File;
  ProfileImageChangedEvent: any = '';
  croppedProfileImage: any = '';
  employee_image: any = "assets/images/MyWallet/defaultpic.png";

  handleProfileImage(event: any, cropperModal): void {
    this.modalService.open(cropperModal);
    this.ProfileImageChangedEvent = event;
  }

  ProfileImageCropped(event: ImageCroppedEvent) {
    this.croppedProfileImage = event.base64;
    this.profileImageUpload = this.profileImagebase64ToFile(
      event.base64,
      this.ProfileImageChangedEvent.target.files[0].name,
    )
    return this.profileImageUpload;
  }

  profileImagebase64ToFile(data, filename) {
    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  UploadProfileCroperImage() {
    this.employee_image = this.croppedProfileImage;
    this.modalService.dismissAll('Closed');
  }
  org_role: string = 'OrganisationHead';

  organisation_list: BusOrganisationsListResponseData[] = [];
  org_name: string;

  bus_organisation_list() {

    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));

    this.uTrackService.bus_organisation_list(formData).subscribe(response => {
      if (response.status) {
        if (response.data != null && response.data != undefined && response.data.length > 0) {
          this.organisation_list = response.data;
          this.org_name = this.organisation_list[0].bus_organisation_id
        }
      }
    })
  }

  branch_organisation_list: BusOrganisationBranchListResponseData[] = [];
  branch_org_name: string;

  bus_organisation_branch_list() {

    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    this.uTrackService.bus_organisation_branch_list(formData).subscribe(response => {
      if (response.status) {
        if (response.data != null && response.data != undefined && response.data.length > 0) {
          this.branch_organisation_list = response.data;
          this.branch_org_name = this.branch_organisation_list[0].bus_organisation_branch_id
        }
      }
    })
  }

  changeOrg(row) {
    this.employeeForm.value.bus_organisation_id = row.bus_organisation_id;
  }

  changeBranchOrg(row) {
    this.employeeForm.value.bus_organisation_branch_id = row.bus_organisation_branch_id;
  }


  createEmployee() {
    let first_name = this.employeeForm.value.first_name;
    let last_name = this.employeeForm.value.last_name;
    let mobile = this.employeeForm.value.mobile;
    let bus_organisation_role = this.employeeForm.value.bus_organisation_role;
    let bus_organisation_id = this.employeeForm.value.bus_organisation_id;
    let bus_organisation_branch_id = this.employeeForm.value.bus_organisation_branch_id;


    if (first_name != undefined && first_name != null && first_name != '' && first_name.length >= 3
      && last_name != undefined && last_name != null && last_name != '' && last_name.length >= 3
      && mobile != undefined && mobile != null && mobile != '' && mobile.length >= 10) {

      const formData = new FormData();
      formData.append('user_id', localStorage.getItem('USER_ID'));
      formData.append('device_token', "Web");
      formData.append('user_type', localStorage.getItem('USER_TYPE'));

      formData.append('first_name', first_name);
      formData.append('last_name', last_name);
      formData.append('mobile', mobile);
      formData.append('bus_organisation_role', bus_organisation_role);
      formData.append('bus_organisation_id', bus_organisation_id);
      formData.append('bus_organisation_branch_id', bus_organisation_branch_id);

      if (this.profileImageUpload != null && this.profileImageUpload != undefined) {
        formData.append('profile_image', this.profileImageUpload, this.profileImageUpload.name);
      } else {
        formData.append('profile_image', '');
      }

      // Additional Params
      formData.append('friend_id', '');
      formData.append('nick_name', '');
      formData.append('joining_date', '');
      formData.append('birth_date', '');
      formData.append('gender', '');
      formData.append('blood_group', '');
      formData.append('driving_licence_id', '');
      formData.append('state_id', '');
      formData.append('district_id', '');
      formData.append('city_id', '');
      formData.append('address', '');
      formData.append('landmark', '');
      formData.append('pincode', '');
      formData.append('area', '');
      formData.append('status', '');
      formData.append('friend_type', '');
      formData.append('added_date', '');

      this.uTrackService.create_bus_staff(formData).subscribe(response => {
        if (response.status) {
          this.toasterService.success('Pragati Utrack', response.message);
          this.location.back();
        } else {
          this.toasterService.danger('Pragati Utrack', response.message);
        }
      })

    } else {
      this.toasterService.danger('Pragati Utrack', 'Please fill mandatory fields..');

    }
  }
}
