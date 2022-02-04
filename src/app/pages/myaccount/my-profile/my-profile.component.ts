import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpEventType, HttpParams } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { DistrictResponse } from '../../../@theme/components/Model/DistrictResponse';
import { StateResponse } from '../../../@theme/components/Model/StateRessponse';
import { MyProfileResponse, MyProfileResponseData } from '../../../@theme/components/Model/MyProfileResponse';
import { EditMyProfileRespones } from '../../../@theme/components/Model/EditMyProfileRespones';
import { NbToastrService } from '@nebular/theme';
import { Location } from '@angular/common';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'ngx-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  fileData: File = null;
  previewUrl: any = null;

  lincencefrontviewUrl: any = "assets/images/myprofile/sample-one.jpg";
  lincenceBackviewUrl: any = "assets/images/myprofile/sample-one.jpg";
  companyLogoviewUrl: any = "assets/images/myprofile/sample-one.jpg";

  fname: any;
  lname: any;
  email: string;
  mnumber: string;
  state_id: string;
  district_id: any;
  AreaName: any;
  pincode: any;
  Address: any;
  DrivingLinceneID: any;
  CompanyName: any;
  company_state_id: any;
  company_district_id: any;
  CompanyArea: any;
  CompanyPincode: any;
  CompanyAddress: any;
  CompanyLandmark: any;
  CompanyEmail: any;
  CompanyPhone: any;
  userData: MyProfileResponseData;
  registeredById: any;

  profileImageUpload: File;
  ProfileImageChangedEvent: any = '';
  croppedProfileImage: any = '';
  UserpreviewUrlImage: any = "assets/images/MyWallet/defaultpic.png";

  isFrontImageShowDiv:boolean;
  isFrontImagesButton:boolean

  licence_front_image_upload: File  ;
  lincenceFrontImageChangedEvent: any;
  lincencefrontcroppedImage: any;
  licence_front_image: string;

  isBackImageShowDiv:boolean;;
  isBackImagesButton:boolean;
 
  lincenceBackImageChangedEvent: any;
  lincenceBackCroppedImage: any;
  licence_Back_image: string;
  licence_back_image_upload: File;

  constructor(private headerService: HeaderInteractorService,
    private routes: Router, private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private toasterService: NbToastrService,
    private location: Location,
    private cd: ChangeDetectorRef,
    private uTrackService: UtrackService,
    private modalService: NgbModal,

  ) {
  
   }

  ngOnInit(): void {
    this.headerService.updateHeaderTitle('HEADER_NAMES.My Profile');
    
    this.uTrackService.translateLanguage();
    this.uTrackService.isUserValid();

    this.getStatesList();
    this.getCompanyStatesList();
    this.getMyProfileData();

    if(this.licence_front_image){
      this.isFrontImageShowDiv = true;
      this.isFrontImagesButton = false;
    }else{
      this.isFrontImageShowDiv = false;
      this.isFrontImagesButton = true;
    }

    if(this.licence_Back_image){
      this.isBackImageShowDiv = true;
      this.isBackImagesButton = false;
    }else{
      this.isBackImageShowDiv = false;
      this.isBackImagesButton = true;
    }
  }

  frontLicenceDeleteImg(){
    this.isFrontImagesButton = true;
    this.isFrontImageShowDiv = false;
  }

  backLicenceDeleteImg(){
    this.isBackImagesButton = true;
    this.isBackImageShowDiv = false;
  }


  fileChangeEvent(event: any, cropperModal): void {
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

  UploadProfileCroppedImage() {
    this.UserpreviewUrlImage = this.croppedProfileImage;
    this.modalService.dismissAll('Closed');
  }


  lincenceFrontFileProgress(event: any, cropperModalLincenceFront): void {
    this.modalService.open(cropperModalLincenceFront);
    this.lincenceFrontImageChangedEvent = event;
  }

  lincenceFrontImageCropped(event: ImageCroppedEvent) {
    this.lincencefrontcroppedImage = event.base64;
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

  lincenceFrontCroperimage() {
    this.licence_front_image = this.lincencefrontcroppedImage;
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

  // companyLogo


  companyLogofileProgress(lincenceBackfileInput: any) {
    this.fileData = <File>lincenceBackfileInput.target.files[0];
    this.companyLogopreview();
  }

  companyLogopreview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.companyLogoviewUrl = reader.result;
    }
  }


  back() {
    this.location.back();
  }

  addMyExecutive() {
    this.routes.navigate([`../my-executive`],
      { relativeTo: this.activatedRoute })
  }
  vehicle_image: string | ArrayBuffer;

  myProfileForm = new FormGroup({

    profileimage: new FormControl('', [Validators.required]),
    lincenceFrontImage: new FormControl('', [Validators.required]),
    lincenceBackImage: new FormControl('', [Validators.required]),
    companyLogoImage: new FormControl('', [Validators.required]),

    firstname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    state: new FormControl('', [Validators.required]),
    district: new FormControl('', [Validators.required]),
    AreaName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    mnumber: new FormControl('', [Validators.required]),
    pincode: new FormControl('', [Validators.required, Validators.minLength(6)]),
    Address: new FormControl('', [Validators.required]),

    DrivingLinceneID: new FormControl('', [Validators.required]),
    // PANID: new FormControl('', [Validators.required]),

    CompanyName: new FormControl('', [Validators.required]),
    companystate: new FormControl('', [Validators.required]),
    companydistrict: new FormControl('', [Validators.required]),
    CompanyArea: new FormControl('', [Validators.required]),
    CompanyAddress: new FormControl('', [Validators.required]),
    CompanyPincode: new FormControl('', [Validators.required, Validators.minLength(6)]),
    CompanyEmail: new FormControl('', [Validators.required, Validators.email]),
    CompanyLandmark: new FormControl('', [Validators.required]),
    CompanyPhone: new FormControl('', [Validators.required, Validators.minLength(10)]),

  })

  getStatesList() {
    this.uTrackService.getStates().subscribe(stateRespone => {
      if (stateRespone.status) {
        this.states = stateRespone.data;
      } else {
        alert(stateRespone.message);
      }
    })
  }

  statesChange(stateid) {
    this.districts = []
    this.getDistrictList(stateid);
  }


  getDistrictList(stateid) {
    this.uTrackService.getDistricts(stateid).subscribe(respone => {
      if (respone.status) {
        this.districts = respone.data;
        this.companydistricts = respone.data;
      }
    })
  }


  getCompanyStatesList() {
    this.uTrackService.getStates().subscribe(stateRespone => {
      if (stateRespone.status) {
        this.companystates = stateRespone.data;
      } else {
        alert(stateRespone.message);
      }
    })
  }

  companyStatesChange(companyStateId) {
    this.companydistricts = []
    this.getCompanyDistrictList(companyStateId);
  }

  getCompanyDistrictList(companyStateId) {
    this.uTrackService.getDistricts(companyStateId).subscribe(respone => {
      if (respone.status) {
        this.companydistricts = respone.data;
      }
    })
  }


  states = []

  districts = []

  companystates = []

  companydistricts = []


  getMyProfileData() {

    this.uTrackService.my_profile().subscribe(response => {
      if (response.status) {

        this.userData = response.data[0];

        this.fname = this.userData.first_name
        this.lname = this.userData.last_name
        this.email = this.userData.email
        this.mnumber = this.userData.mobile
        this.state_id = this.userData.state_id
        this.district_id = this.userData.district_id
        this.AreaName = this.userData.area_name
        this.pincode = this.userData.zipcode
        this.Address = this.userData.address1
        this.DrivingLinceneID = this.userData.dl_number
        this.CompanyName = this.userData.company_name
        this.company_state_id = this.userData.company_state_id
        this.company_district_id = this.userData.company_district_id
        this.CompanyArea = this.userData.company_area
        this.CompanyPincode = this.userData.company_pincode
        this.CompanyAddress = this.userData.company_address
        this.CompanyLandmark = this.userData.company_landmark
        this.CompanyEmail = this.userData.company_email
        this.CompanyPhone = this.userData.company_mobile
        this.companyLogoviewUrl = this.userData.company_logo
        this.licence_front_image = this.userData.dl_front
        this.licence_Back_image = this.userData.dl_back
        this.UserpreviewUrlImage = this.userData.profile_image
        this.registeredById = this.userData.registered_by_id

        localStorage.setItem('my_excutive_registered_id', this.userData.registered_by_id);

        if (this.registeredById == 0) {
          document.getElementById("btn_hide_registered_id").style.display = "none";
        }
      }
    })
  }

  editMyProfile() {
    if (localStorage.getItem("MOBILE") == "9966663333") {
      this.toasterService.danger("Please login with your credentials to proceed, This is demo account.")
    } else {

      const formData = new FormData();

      formData.append('user_id', localStorage.getItem("USER_ID"));
      formData.append('profile_image', this.profileImageUpload);

      formData.append('first_name', this.myProfileForm.value.firstname);
      formData.append('last_name', this.myProfileForm.value.lastname);
      formData.append('state_id', this.myProfileForm.value.state);
      formData.append('district_id', this.myProfileForm.value.district);
      formData.append('area_name', this.myProfileForm.value.AreaName);
      formData.append('email', this.myProfileForm.value.email);
      formData.append('mobile', this.myProfileForm.value.mnumber);
      formData.append('zipcode', this.myProfileForm.value.pincode);
      formData.append('address1', this.myProfileForm.value.Address);

      formData.append('dl_front', this.licence_front_image_upload);
      formData.append('dl_back', this.licence_back_image_upload);

      formData.append('dl_number', this.myProfileForm.value.DrivingLinceneID);
      // formData.append('password', this.myProfileForm.value.PANID);

      formData.append('company_logo', this.myProfileForm.value.companyLogoImage);
      formData.append('company_name', this.myProfileForm.value.CompanyName);
      formData.append('company_state_id', this.myProfileForm.value.companystate);
      formData.append('company_district_id', this.myProfileForm.value.companydistrict);
      formData.append('company_area', this.myProfileForm.value.CompanyArea);
      formData.append('company_address', this.myProfileForm.value.CompanyAddress);
      formData.append('company_pincode', this.myProfileForm.value.CompanyPincode);
      formData.append('company_email', this.myProfileForm.value.CompanyEmail);
      formData.append('company_landmark', this.myProfileForm.value.CompanyLandmark);
      formData.append('company_mobile', this.myProfileForm.value.CompanyPhone);
      formData.append('user_type', "Customer");
      formData.append('device_token', "Web");

      this.uTrackService.edit_profile(formData).subscribe(response => {
        if (response.status) {

          this.toasterService.success('Pragati Utrack', response.message)
          window.location.reload();
        } else {

          this.toasterService.danger('Pragati Utrack', response.message)

        }
      })

    }

  }

}


