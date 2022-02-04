import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import { NbToastrService } from '@nebular/theme';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DateUtils } from '../../../../@theme/components/Services/date_utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-add-shared-user',
  templateUrl: './add-shared-user.component.html',
  styleUrls: ['./add-shared-user.component.scss']
})
export class AddSharedUserComponent implements OnInit {

  sharedUserId: any
  isSubmit: boolean;
  pipe = new DatePipe('en-us')
  todayDate = new Date()

  //Edit Data Binding
  nickName: string
  firstName: string
  lastName: string
  mobileNumber: string
 
  profileImageUpload: File;
  sharedImageChangedEvent: any = '';
  croppedSharedImage: any = '';
  shared_user_image: any = "assets/images/MyWallet/defaultpic.png";

  constructor(private uTrackService: UtrackService,
    private location: Location, private toasterService: NbToastrService,
    private headerService: HeaderInteractorService,
    private activatedRoute: ActivatedRoute, private http: HttpClient,
    private cd: ChangeDetectorRef,
    private modalService: NgbModal,
 
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.sharedUserId = params.user_id;
    });
 
  }


  AddSharedUserRegistrationForm = new FormGroup({
    fctrl_image: new FormControl(''),
    fctrl_nickname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    fctrl_first_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    fctrl_last_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    fctrl_mobile_number: new FormControl('', [Validators.required, Validators.minLength(10)]),

  })

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    if (this.sharedUserId === undefined) {
      this.headerService.updateHeaderTitle('HEADER_NAMES.Add Shared User')
      this.isSubmit = true;
    } else {
      this.headerService.updateHeaderTitle('HEADER_NAMES.Edit Shared User')
      this.isSubmit = false;
      this.editSharedUser();
    }
  }

  back() {
    this.location.back();
  }

  handleSharedImage(event: any,cropperModal): void {
    this.modalService.open(cropperModal);
    this.sharedImageChangedEvent = event;
  }

  SharedImageCropped(event: ImageCroppedEvent) {
    this.croppedSharedImage = event.base64;
    this.profileImageUpload = this.SharedImagebase64ToFile(
      event.base64,
      this.sharedImageChangedEvent.target.files[0].name,
    )
    return this.profileImageUpload;
  }

  SharedImagebase64ToFile(data, filename) {
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

  UploadSharedCroperImage() {
    this.shared_user_image = this.croppedSharedImage;
    this.modalService.dismissAll('Closed');
  }

  addSharedUser() {

    if (localStorage.getItem("MOBILE") == "9966663333") {
      this.toasterService.danger("Please login with your credentials to proceed, This is demo account.")
    } else {
      if (this.AddSharedUserRegistrationForm.value.fctrl_nickname != undefined && this.AddSharedUserRegistrationForm.value.fctrl_nickname != ""
        && this.AddSharedUserRegistrationForm.value.fctrl_first_name != undefined && this.AddSharedUserRegistrationForm.value.fctrl_first_name != ""
        && this.AddSharedUserRegistrationForm.value.fctrl_last_name != undefined && this.AddSharedUserRegistrationForm.value.fctrl_last_name != ""
        && this.AddSharedUserRegistrationForm.value.fctrl_mobile_number != undefined && this.AddSharedUserRegistrationForm.value.fctrl_mobile_number != "") {

        const formData = new FormData();
        formData.append('user_id', localStorage.getItem('USER_ID'));
        formData.append('user_type', localStorage.getItem("USER_TYPE"));
        formData.append('device_token', "Web");

        formData.append('first_name', this.AddSharedUserRegistrationForm.value.fctrl_first_name);
        formData.append('last_name', this.AddSharedUserRegistrationForm.value.fctrl_last_name);
        formData.append('nick_name', this.AddSharedUserRegistrationForm.value.fctrl_nickname);
        formData.append('mobile', this.AddSharedUserRegistrationForm.value.fctrl_mobile_number);
        formData.append('type', "0");
        formData.append('status', "Active");

        formData.append('joining_date', DateUtils.getServerTodayDate());
        formData.append('birth_date', DateUtils.getServerTodayDate());
        formData.append('gender', "Male");
        formData.append('blood_group', "A");
        formData.append('driving_licence_id', "A");
        formData.append('pan_id', "A");
        formData.append('state_id', "");
        formData.append('district_id', "");
        formData.append('city_id', "");
        formData.append('address', "");
        formData.append('landmark', "");
        formData.append('pincode', "");
        formData.append('area', "");


        if (this.profileImageUpload != null && this.profileImageUpload != undefined) {
          formData.append('profile_image', this.profileImageUpload, this.profileImageUpload.name);
        }

        this.uTrackService.create_my_user(formData).subscribe(response => {
          if (response.status) {
            this.toasterService.success('Pragati Utrack', response.message)
            this.location.back();
          } else {
            this.toasterService.danger('Pragati Utrack', response.message)
          }
        })
      }
    }
  }


  editSharedUser() {

    this.uTrackService.shared_user_detail(this.sharedUserId).subscribe(response => {

      response.data.forEach(element => {
        this.nickName = element.nick_name
        this.firstName = element.first_name
        this.lastName = element.last_name
        this.mobileNumber = element.mobile
        this.shared_user_image = element.profile_image
 
      })

      // for (let data of response.data) {
      //   this.nickName = data.nick_name
      //   this.firstName = data.first_name
      //   this.lastName = data.last_name
      //   this.mobileNumber = data.mobile
      // }

    })

  }
}
