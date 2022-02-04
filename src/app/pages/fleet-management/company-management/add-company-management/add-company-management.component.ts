import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'ngx-add-company-management',
  templateUrl: './add-company-management.component.html',
  styleUrls: ['./add-company-management.component.scss']
})
export class AddCompanyManagementComponent implements OnInit {

  CompanyImageUpload: File;
  CompanyImageChangedEvent: any = '';
  croppedCompanyImage: any = '';
  company_image: any = "assets/images/MyWallet/bank-default.jpg";

  companyId: string;
  isSubmit: boolean;

  constructor(private headerService: HeaderInteractorService,
    private location: Location,
    private uTrackService: UtrackService,
    private activatedRoute: ActivatedRoute,
    private toasterService: NbToastrService,
    private modalService: NgbModal,
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.companyId = params.company_id;
    });
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    if (this.companyId == undefined) {
      this.headerService.updateHeaderTitle('HEADER_NAMES.Add Company Management');
      this.isSubmit = true;
    } else {
      this.headerService.updateHeaderTitle('HEADER_NAMES.Edit Company Management');
      this.isSubmit = false;
      this.editCompanyData();
    }
    this.getStateList();
    this.initMap();
  }

  createCompanyForm = new FormGroup({
    image: new FormControl(''),
    companyName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    company_url: new FormControl(''),
    state: new FormControl('', [Validators.required]),
    district: new FormControl('', [Validators.required]),
    Address1: new FormControl(''),
    Address2: new FormControl(''),
    landmark: new FormControl(''),
    Address: new FormControl(''),
    latitude: new FormControl(''),
    longitude: new FormControl(''),
    pincode: new FormControl('', [Validators.required, Validators.minLength(6)]),
    email: new FormControl(''),
    company_mobile: new FormControl(''),
    status: new FormControl(''),
    google_address: new FormControl(''),
  })

  states = []
  districts = []

  onStateChange(e) {
    this.districts = []
    this.getDistricts();
  }

  getStateList() {
    this.uTrackService.getStates().subscribe(response => {
      if (response.status) {
        this.states = response.data
        this.getDistricts();
      }
    })
  }

  getDistricts() {
    this.uTrackService.getDistricts(this.createCompanyForm.value.state).subscribe(response => {
      if (response.status) {
        this.districts = response.data
      } else {
      }
    })
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

  back() {
    this.location.back()
  }

  handleCompanyImage(event: any, cropperModal): void {
    this.modalService.open(cropperModal);
    this.CompanyImageChangedEvent = event;
  }

  CompanyImageCropped(event: ImageCroppedEvent) {
    this.croppedCompanyImage = event.base64;
    this.CompanyImageUpload = this.CompanyImagebase64ToFile(
      event.base64,
      this.CompanyImageChangedEvent.target.files[0].name,
    )
    return this.CompanyImageUpload;
  }

  CompanyImagebase64ToFile(data, filename) {
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

  UploadCompanyCroperImage() {
    this.company_image = this.croppedCompanyImage;
    this.modalService.dismissAll('Closed');
  }


  submit() {
    if (localStorage.getItem("MOBILE") == "9966663333") {
      this.toasterService.danger("Please login with your credentials to proceed, This is demo account.")
    } else {
      if (this.createCompanyForm.value.companyName != "" && this.createCompanyForm.value.companyName != undefined
        && this.createCompanyForm.value.state != "" && this.createCompanyForm.value.state != undefined
        && this.createCompanyForm.value.district != "" && this.createCompanyForm.value.district != undefined
        && this.createCompanyForm.value.pincode != "" && this.createCompanyForm.value.pincode != undefined
      ) {
        var company_url = this.createCompanyForm.value.company_url
        if (company_url == null || company_url == undefined) {
          company_url = ""
        }

        var land_mark = this.createCompanyForm.value.landmark
        if (land_mark == null || land_mark == undefined) {
          land_mark = ""
        }

        var Address1 = this.createCompanyForm.value.Address1
        if (Address1 == null || Address1 == undefined) {
          Address1 = "Test"
        }

        var Address2 = this.createCompanyForm.value.Address2
        if (Address2 == null || Address2 == undefined) {
          Address2 = "Test"
        }

        var company_email_id = this.createCompanyForm.value.email
        if (company_email_id == null || company_email_id == undefined) {
          company_email_id = ""
        }

        var company_phone_number = this.createCompanyForm.value.company_mobile
        if (company_phone_number == null || company_phone_number == undefined) {
          company_phone_number = ""
        }

        if (this.companyId == undefined) {
          const formData = new FormData();
          formData.append('user_id', localStorage.getItem('USER_ID'));
          formData.append('user_type', localStorage.getItem("USER_TYPE"));
          formData.append('device_token', "Web");
          formData.append('company_name', this.createCompanyForm.value.companyName);
          formData.append('company_website', company_url);
          formData.append('company_state_id', this.createCompanyForm.value.state);
          formData.append('company_district_id', this.createCompanyForm.value.district);
          formData.append('company_city_id', "1");
          formData.append('company_google_address', this.searchname);
          formData.append('company_latitude', this.latitude);
          formData.append('company_longitude', this.longitude);
          formData.append('company_landmark', land_mark);
          formData.append('company_address1', Address1);
          formData.append('company_address2', Address2);
          formData.append('company_pincode', this.createCompanyForm.value.pincode);
          formData.append('company_email', company_email_id);
          formData.append('company_mobile', company_phone_number);
          formData.append('status', this.createCompanyForm.value.status);
          if (this.CompanyImageUpload != null && this.CompanyImageUpload != undefined) {
            formData.append('company_logo', this.CompanyImageUpload, this.CompanyImageUpload.name);
          }
          this.uTrackService.my_company_create(formData).subscribe(response => {
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
          formData.append('company_name', this.createCompanyForm.value.companyName);
          formData.append('company_website', this.createCompanyForm.value.company_url);
          formData.append('company_state_id', this.createCompanyForm.value.state);
          formData.append('company_district_id', this.createCompanyForm.value.district);
          formData.append('company_city_id', "1");
          formData.append('company_google_address', this.searchname);
          formData.append('company_latitude', this.latitude);
          formData.append('company_longitude', this.longitude);
          formData.append('company_landmark', this.createCompanyForm.value.landmark);
          formData.append('company_address1', Address1);
          formData.append('company_address2', Address2);
          formData.append('company_pincode', this.createCompanyForm.value.pincode);
          formData.append('company_email', this.createCompanyForm.value.email);
          formData.append('company_mobile', this.createCompanyForm.value.company_mobile);
          formData.append('status', this.createCompanyForm.value.status);
          formData.append('company_id', this.companyId);
          if (this.CompanyImageUpload != null && this.CompanyImageUpload != undefined) {
            formData.append('company_logo', this.CompanyImageUpload, this.CompanyImageUpload.name);
          }
          this.uTrackService.my_company_edit(formData).subscribe(response => {
            if (response.status) {
              this.toasterService.success('', response.message)
              this.location.back();
            } else {
              this.toasterService.danger('', response.message)
            }
          })
        }
      } else {
        this.toasterService.danger('', "Please fill all mandatory Information.");
      }
    }
  }

  //binding data
  companyName: string;
  comapnayUrl: string;
  companyState: string;
  companyDistrict: string;
  companyLandmark: string;
  companyAddress1: string;
  companyAddress2: string;
  companyLatitude: string;
  companyLongitude: string;
  companyPincode: string;
  companyEmail: string;
  comapanyPhoneNumber: string;;
  status: string;;
  googleAddress: string;

  editCompanyData() {
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    formData.append('user_type', localStorage.getItem('USER_TYPE'));
    formData.append('device_token', 'Web');
    formData.append('company_id', this.companyId);
    this.uTrackService.my_company_detail(formData).subscribe(response => {
      if (response.data != undefined && response.data != null) {
        this.company_image = response.data.company_logo
        this.companyName = response.data.company_name
        this.comapnayUrl = response.data.company_website
        this.companyState = response.data.company_state_id
        this.companyDistrict = response.data.company_district_id
        this.companyAddress1 = response.data.company_address1
        this.companyLandmark = response.data.company_landmark
        this.companyAddress2 = response.data.company_address2
        this.companyLatitude = response.data.company_latitude
        this.companyLongitude = response.data.company_longitude
        this.companyPincode = response.data.company_pincode
        this.companyEmail = response.data.company_email
        this.comapanyPhoneNumber = response.data.company_mobile
        this.status = response.data.status
        this.googleAddress = response.data.company_google_address;
        this.searchname = response.data.company_google_address
      }
    })
  }
}
