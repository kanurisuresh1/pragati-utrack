import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import { Location } from '@angular/common';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { NbToastrService } from '@nebular/theme';
import { ActivatedRoute } from '@angular/router';
import { DriverDetailsData } from '../../../../@theme/components/Model/DriverDetailsResponse';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateUtils } from '../../../../@theme/components/Services/date_utils';

export const MY_FORMATS = {
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};

@Component({
  selector: 'ngx-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },

  ],
})
export class AddDriverComponent implements OnInit {

  states = [];
  districts = [];
  cities = [];
  driverId: string;
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
  DriverData: DriverDetailsData;

  profileImageUpload: File;
  ProfileImageChangedEvent: any = '';
  croppedProfileImage: any = '';
  driver_image: any = "assets/images/MyWallet/defaultpic.png";

  isFrontImageShowDiv: boolean;
  isFrontImagesButton: boolean

  licence_front_image_upload: File;
  lincenceFrontImageChangedEvent: any;
  lincenceFrontCroppedImage: any;
  licence_front_image: any;

  isBackImageShowDiv: boolean;
  isBackImagesButton: boolean;

  lincenceBackImageChangedEvent: any;
  lincenceBackCroppedImage: any;
  licence_Back_image: any;
  licence_back_image_upload: File;

  isPanCardFrontImageShowDiv: boolean;
  isPanCardFrontImagesButton: boolean

  PanCard_front_image_upload: File;
  PanCardFrontImageChangedEvent: any;
  PanCardFrontCroppedImage: any;
  PanCard_front_image: any;

  constructor(private uTrackService: UtrackService,
    private location: Location,
    private toasterService: NbToastrService,
    private headerService: HeaderInteractorService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,

  ) {
    this.activatedRoute.params.subscribe(params => {
      this.driverId = params.user_id;
    })

  }

  AddDriverRegistrationForm = new FormGroup({
    fctrl_image: new FormControl(''),
    fctrl_nickname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    fctrl_first_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    fctrl_last_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    fctrl_mobile_number: new FormControl('', [Validators.required, Validators.minLength(10)]),
    fctrl_dob: new FormControl('', [Validators.required]),
    fctrl_doj: new FormControl('', [Validators.required]),
    fctrl_blood_group: new FormControl('', [Validators.required]),
    fctrl_gender: new FormControl('', [Validators.required]),
    fctrl_driving_licece_id: new FormControl('', [Validators.required, Validators.minLength(16)]),
    fctrl_pan_id: new FormControl(''),
    fctrl_state: new FormControl(''),
    fctrl_district: new FormControl(''),
    fctrl_city: new FormControl(''),
    fctrl_pincode: new FormControl(''),
    fctrl_area: new FormControl(''),
    fctrl_landmark: new FormControl(''),
    fctrl_address: new FormControl(''),
    lincenceFrontImage: new FormControl(''),
    lincenceBackImage: new FormControl(''),
    PanCardFrontImage: new FormControl(''),
  })

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    if (this.driverId === undefined) {
      this.headerService.updateHeaderTitle('HEADER_NAMES.Add Driver')
      this.isSubmit = true;
      this.isFrontImagesButton = true;
      this.isBackImagesButton = true;
      this.isPanCardFrontImagesButton = true;
    } else {
      this.headerService.updateHeaderTitle('HEADER_NAMES.Edit Driver')
      this.isSubmit = false;
      this.editDriver();
    }

    this.getStateList();
  }

  back() {
    this.location.back();
  }

  lincenceFrontImageDelete() {
    this.isFrontImageShowDiv = false;
    this.isFrontImagesButton = true;
  }

  lincenceBackImageDelete() {
    this.isBackImagesButton = true;
    this.isBackImageShowDiv = false;
  }

  PanCardFrontImageDelete() {
    this.isPanCardFrontImagesButton = true;
    this.isPanCardFrontImageShowDiv = false;
  }

  handleProfileImage(event: any, cropperModal): void {
    this.modalService.open(cropperModal);
    this.ProfileImageChangedEvent = event;
  }

  ProfileImageCropped(event: ImageCroppedEvent) {
    this.croppedProfileImage = event.base64;
    this.profileImageUpload = this.ProfileImagebase64ToFile(
      event.base64,
      this.ProfileImageChangedEvent.target.files[0].name,
    )
    return this.profileImageUpload;
  }

  ProfileImagebase64ToFile(data, filename) {
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
    this.driver_image = this.croppedProfileImage;
    this.modalService.dismissAll('Closed');
  }

  lincenceFrontFileProgress(event: any, cropperModalLincenceFront): void {
    this.modalService.open(cropperModalLincenceFront);
    this.lincenceFrontImageChangedEvent = event;
  }

  lincenceFrontImageCropped(event: ImageCroppedEvent) {
    this.lincenceFrontCroppedImage = event.base64;
    this.licence_front_image_upload = this.lincenceFrontbase64ToFile(
      event.base64,
      this.lincenceFrontImageChangedEvent.target.files[0].name,
    )
    return this.licence_front_image_upload;
  }

  lincenceFrontbase64ToFile(data, filename) {
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

  lincenceFrontCroperImage() {
    this.licence_front_image = this.lincenceFrontCroppedImage;
    this.isFrontImagesButton = false;
    this.isFrontImageShowDiv = true;
    this.modalService.dismissAll('Closed');
  }


  lincenceBackFileProgress(event: any, cropperModalLincenceBack): void {
    this.modalService.open(cropperModalLincenceBack);
    this.lincenceBackImageChangedEvent = event;

  }

  lincenceBackImageCropped(event: ImageCroppedEvent) {
    this.lincenceBackCroppedImage = event.base64;
    this.licence_back_image_upload = this.lincenceBackbase64ToFile(
      event.base64,
      this.lincenceBackImageChangedEvent.target.files[0].name,
    )
    return this.licence_back_image_upload;
  }

  lincenceBackbase64ToFile(data, filename) {
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

  lincenceBackCroperImage() {
    this.licence_Back_image = this.lincenceBackCroppedImage;
    this.isBackImagesButton = false;
    this.isBackImageShowDiv = true;
    this.modalService.dismissAll('Closed');
  }

  // pan car front image

  PanCardFrontFileProgress(event: any, cropperModalPanCardFront): void {
    this.modalService.open(cropperModalPanCardFront);
    this.PanCardFrontImageChangedEvent = event;
  }

  PanCardFrontImageCropped(event: ImageCroppedEvent) {
    this.PanCardFrontCroppedImage = event.base64;
    this.PanCard_front_image_upload = this.PanCardFrontbase64ToFile(
      event.base64,
      this.PanCardFrontImageChangedEvent.target.files[0].name,
    )
    return this.PanCard_front_image_upload;
  }

  PanCardFrontbase64ToFile(data, filename) {
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

  PanCardFrontCroperImage() {
    this.PanCard_front_image = this.PanCardFrontCroppedImage;
    this.isPanCardFrontImagesButton = false;
    this.isPanCardFrontImageShowDiv = true;
    this.modalService.dismissAll('Closed');
  }

  onStateChange(e) {
    this.districts = []
    // this.cities = []
    this.getDistricts();
  }

  onDistrictChange(e) {
    this.cities = []
    this.getCities();
  }

  getStateList() {
    this.uTrackService.getStates().subscribe(response => {
      if (response.status) {
        this.states = response.data;
      }
    })
  }

  getDistricts() {
    this.uTrackService.getDistricts(this.AddDriverRegistrationForm.value.fctrl_state).subscribe(response => {
      if (response.status) {
        this.districts = response.data
      } else {
      }
    })
  }

  getCities() {
    this.uTrackService.getCities(this.AddDriverRegistrationForm.value.fctrl_district).subscribe(response => {
      if (response.status) {
        this.cities = response.data
      } else {
      }
    })
  }

  addDriver() {

    if (localStorage.getItem("MOBILE") == "9966663333") {
      this.toasterService.danger('', "Please login with your credentials to proceed, This is demo account.")
    } else {
      if (this.AddDriverRegistrationForm.value.fctrl_nickname != undefined && this.AddDriverRegistrationForm.value.fctrl_nickname != ""
        && this.AddDriverRegistrationForm.value.fctrl_first_name != undefined && this.AddDriverRegistrationForm.value.fctrl_first_name != ""
        && this.AddDriverRegistrationForm.value.fctrl_last_name != undefined && this.AddDriverRegistrationForm.value.fctrl_last_name != ""
        && this.AddDriverRegistrationForm.value.fctrl_mobile_number != undefined && this.AddDriverRegistrationForm.value.fctrl_mobile_number != ""
        && this.AddDriverRegistrationForm.value.fctrl_dob != undefined && this.AddDriverRegistrationForm.value.fctrl_dob != ""
        && this.AddDriverRegistrationForm.value.fctrl_doj != undefined && this.AddDriverRegistrationForm.value.fctrl_doj != ""
        && this.AddDriverRegistrationForm.value.fctrl_blood_group != undefined && this.AddDriverRegistrationForm.value.fctrl_blood_group != ""
        && this.AddDriverRegistrationForm.value.fctrl_gender != undefined && this.AddDriverRegistrationForm.value.fctrl_gender != ""
        && this.AddDriverRegistrationForm.value.fctrl_driving_licece_id != undefined && this.AddDriverRegistrationForm.value.fctrl_driving_licece_id != "") {

        const formData = new FormData();
        formData.append('user_id', localStorage.getItem('USER_ID'));
        formData.append('user_type', localStorage.getItem("USER_TYPE"));
        formData.append('device_token', "Web");

        formData.append('first_name', this.AddDriverRegistrationForm.value.fctrl_first_name);
        formData.append('last_name', this.AddDriverRegistrationForm.value.fctrl_last_name);
        formData.append('nick_name', this.AddDriverRegistrationForm.value.fctrl_nickname);

        formData.append('dl_front', this.licence_front_image_upload);
        formData.append('dl_back', this.licence_back_image_upload);

        formData.append('mobile', this.AddDriverRegistrationForm.value.fctrl_mobile_number);
        formData.append('joining_date', DateUtils.getServerDate(this.AddDriverRegistrationForm.value.fctrl_doj));
        formData.append('birth_date', DateUtils.getServerDate(this.AddDriverRegistrationForm.value.fctrl_dob));

        formData.append('gender', this.AddDriverRegistrationForm.value.fctrl_gender);
        formData.append('blood_group', this.AddDriverRegistrationForm.value.fctrl_blood_group);

        formData.append('type', "1");
        formData.append('driving_licence_id', this.AddDriverRegistrationForm.value.fctrl_driving_licece_id);
        formData.append('p_front', this.PanCard_front_image_upload);
        formData.append('pan_id', this.AddDriverRegistrationForm.value.fctrl_pan_id);
        formData.append('state_id', this.AddDriverRegistrationForm.value.fctrl_state);
        formData.append('district_id', this.AddDriverRegistrationForm.value.fctrl_district);
        formData.append('city_id', this.AddDriverRegistrationForm.value.fctrl_city);
        formData.append('address', this.AddDriverRegistrationForm.value.fctrl_address);
        formData.append('landmark', this.AddDriverRegistrationForm.value.fctrl_landmark);
        formData.append('pincode', this.AddDriverRegistrationForm.value.fctrl_pincode);
        formData.append('area', this.AddDriverRegistrationForm.value.fctrl_area);
        formData.append('status', "Active");

        if (this.profileImageUpload != null && this.profileImageUpload != undefined) {
          formData.append('profile_image', this.profileImageUpload);
        }

        this.uTrackService.create_my_user(formData).subscribe(response => {
          if (response.status) {
            this.toasterService.success('', response.message);
            this.location.back();
          } else {
            this.toasterService.danger('', response.message);
          }
        })
      }
    }

  }


  editDriver() {
    this.uTrackService.driver_detail(this.driverId).subscribe(response => {
      this.DriverData = response.data[0];
      this.driver_image = this.DriverData.profile_image
      this.nickName = this.DriverData.nick_name
      this.firstName = this.DriverData.first_name
      this.lastName = this.DriverData.last_name
      this.mobileNumber = this.DriverData.mobile
      this.dateOfBirth = new Date(this.DriverData.birth_date)
      this.dateOfJoin = new Date(this.DriverData.joining_date)
      this.bloodGroup = this.DriverData.blood_group
      this.gender = this.DriverData.gender
      this.drivingLicenceId = this.DriverData.driving_licence_id
      this.panId = this.DriverData.pan_id
      this.stateId = this.DriverData.state_id
      this.districtId = this.DriverData.district_id
      this.cityId = this.DriverData.city_id
      this.pincode = this.DriverData.pincode
      this.area = this.DriverData.area
      this.landmark = this.DriverData.landmark
      this.address = this.DriverData.address
      this.licence_front_image = this.DriverData.dl_front
      this.licence_Back_image = this.DriverData.dl_back
      this.PanCard_front_image = this.DriverData.p_front

      if (this.licence_front_image) {
        this.isFrontImageShowDiv = true;
      }

      if (this.licence_Back_image) {
        this.isBackImageShowDiv = true;
      }

      if (this.PanCard_front_image) {
        this.isPanCardFrontImageShowDiv = true;
      }
    })
  }
}
