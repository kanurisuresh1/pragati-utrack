import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl, } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoginResponse, Login } from '../@theme/components/Model/LoginResponse';
import { environment } from '../../environments/environment';
import { UtrackService } from '../@theme/components/Services/Utrack.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import $ from 'jquery';
import { NbToastrService } from '@nebular/theme';
import { Location } from '@angular/common';
import { ImageCroppedEvent } from 'ngx-image-cropper';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  swal: any;
  userData: Login;
  isRemember: boolean;
  loginRemember: boolean;
  loginNumber: string;
  loginPassword: string;
  loading: boolean;
  error = '';
  user_id: string;

  fileToReturnUplodeImage: File;
  ProfileImageChangedEvent: any = '';
  croppedProfileImage: any = '';
  Profile_image: any = "assets/images/MyWallet/defaultpic.png";


  states = [];
  districts = [];
  data: any;

  constructor(private router: Router, private http: HttpClient, private uTrackService: UtrackService,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef,
    private toasterService: NbToastrService,
    private location: Location,

  ) {
   
  }

  ngOnInit(): void {


    if ('1' === localStorage.getItem('IS_REMEMBER')) {
      this.loginNumber = localStorage.getItem('LOGIN_MOBILE_NUMBER');
      this.loginPassword = localStorage.getItem('LOGIN_PASSWORD');
      this.isRemember = true;
    }

    this.user_id = localStorage.getItem('USER_ID');
    if (this.user_id != null && this.user_id.length > 0) {
     this.loginApiCall( localStorage.getItem('LOGIN_MOBILE_NUMBER'),localStorage.getItem('LOGIN_PASSWORD'));
    } 
    this.getStateList();

  }

  checked(e) {
    this.isRemember = e.target.checked;
  }

  loginForm = new FormGroup({
    number: new FormControl('', [Validators.required, Validators.minLength(10)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    rememberMe: new FormControl(''),
  });

  forgotPasswordForm = new FormGroup({
    forgotPassword: new FormControl('', [Validators.required, Validators.minLength(10)]),
  });

  resetPasswordForm = new FormGroup({
    // reset_code: new FormControl(''),
    reset_new_password: new FormControl(''),
    reset_cnfm_password: new FormControl(''),
  });

  signUpForm = new FormGroup({
    sign_image: new FormControl(''),
    sign_first_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    sign_last_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    sign_mobilenumber: new FormControl('', [Validators.required, Validators.minLength(10)]),
    sign_password: new FormControl('', [Validators.required, Validators.minLength(3)]),
    sign_cnfm_password: new FormControl('', [Validators.required, Validators.minLength(3)]),
    sign_state: new FormControl(''),
    sign_district: new FormControl(''),
    sign_address: new FormControl(''),
    sign_area: new FormControl(''),
    sign_pincode: new FormControl(''),
    sign_referalcode: new FormControl(''),
    sign_terms_condition: new FormControl(''),

  });


  fileChangeEvent(event: any, cropperModal): void {
    this.modalService.open(cropperModal);
    this.ProfileImageChangedEvent = event;
  }

  ProfileImageCropped(event: ImageCroppedEvent) {
    this.croppedProfileImage = event.base64;
    this.fileToReturnUplodeImage = this.ProfileImagebase64ToFile(
      event.base64,
      this.ProfileImageChangedEvent.target.files[0].name,
    )
    // console.log(this.fileToReturnUplodeImage);
    return this.fileToReturnUplodeImage;
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

  UploadCroperProfileImage() {
    this.Profile_image = this.croppedProfileImage;
    this.modalService.dismissAll('Closed');
  }


  @ViewChild('modal') closeBtn: ElementRef;
  @ViewChild('reset') resetBtn: ElementRef;


  otp: string;
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '-',
    inputStyles: {
      'width': '50px',
      'height': '50px',
      'color': 'blue',
      'background-color': 'white',
    },
  };

  onOtpChange(otp) {
    this.otp = otp;
  }


  customer_signup() {
    if (this.signUpForm.value.sign_image == "") {
      alert("Please select Image.");
      // this.toasterService.danger('Pragati Utrack', "Please fill all mandatory Information.");
    } else if (this.signUpForm.value.sign_first_name == "") {
      alert("Please enter First Name ");
    } else if (this.signUpForm.value.sign_last_name == "") {
      alert("Please enter Last Name ");
    } else if (this.signUpForm.value.email == "") {
      alert("Please enter valid Email ");
    } else if (this.signUpForm.value.sign_mobilenumber == "") {
      alert("Pleae enter Mobile Number.");
    } else if (this.signUpForm.value.sign_password == "") {
      alert("Please enter Password");
    } else if (this.signUpForm.value.sign_cnfm_password == "") {
      alert("Please enter conform Password");
    } else if (this.signUpForm.value.sign_password !== this.signUpForm.value.sign_cnfm_password) {
      alert('Password and Confirm Password Should be same.');
    } else if (this.signUpForm.value.sign_state == "") {
      alert("please select State ");
    } else if (this.signUpForm.value.sign_district == "") {
      alert("please select District");
    } else if (this.signUpForm.value.sign_terms_condition == "") {
      alert("select Terms & Conditions");
    }

    else {
      const formData = new FormData();

      formData.append('user_type', 'Customer');
      formData.append('device_token', 'Web');
      formData.append('first_name', this.signUpForm.value.sign_first_name);
      formData.append('last_name', this.signUpForm.value.sign_last_name);
      formData.append('email', this.signUpForm.value.email);
      formData.append('mobile', this.signUpForm.value.sign_mobilenumber);
      formData.append('password', this.signUpForm.value.sign_password);
      formData.append('state_id', this.signUpForm.value.sign_state);
      formData.append('district_id', this.signUpForm.value.sign_district);
      formData.append('city_id', '');
      formData.append('address1', this.signUpForm.value.sign_address);
      formData.append('address2', this.signUpForm.value.sign_area);
      formData.append('zipcode', this.signUpForm.value.sign_pincode);
      formData.append('referred_by_id', '');
      formData.append('profile_image', this.fileToReturnUplodeImage);

      this.uTrackService.customer_signup(formData).subscribe(response => {

        if (response.status) {
          alert(response.message);
          window.location.reload();
        } else {
          alert(response.message);
        }

      });
    }
  }

  signUp(signUpModal) {
    this.modalService.open(signUpModal, { ariaLabelledBy: 'sign-up-modal' }).result.then(() => {
    }, () => {
    });
  }


  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(() => {
    }, () => {
    });
  }

  reset(reset) {

    this.modalService.open(reset, { ariaLabelledBy: 'test' }).result.then(() => {
    }, () => {
    });
  }

  forgot_mobile_number: string;
  forgot_user_name: string;
  forgot_user_id: string;
  forgot_verify_code: number;

  forgot_password() {
    const formData = new FormData();
    formData.append('user_type', 'Customer');
    formData.append('device_token', 'Web');
    formData.append('mobile', this.forgotPasswordForm.value.forgotPassword);

    this.uTrackService.forgot_password(formData).subscribe(response => {
      if (response.status) {
        this.modalService.dismissAll('Closed');
        alert(response.message);
        this.forgot_mobile_number = '';
        this.forgot_user_name = response.data.first_name;
        this.forgot_user_id = response.data.user_id;
        this.forgot_verify_code = response.data.verify_code;
        if (true) {
          this.modalService.open(this.resetBtn);
        }
      } else {
        alert(response.message);
      }
    });
  }


  reset_password() {
    if (this.otp === String(this.forgot_verify_code)) {

      const formData = new FormData();
      formData.append('user_id', this.forgot_user_id);
      formData.append('device_token', 'Web');
      formData.append('verify_code', this.otp);
      formData.append('password', this.resetPasswordForm.value.reset_new_password);

      this.uTrackService.reset_password(formData).subscribe(response => {
        if (response.status) {
          this.modalService.dismissAll('Closed');
          alert(response.message);
        } else {
          alert(response.message);
        }
      });
    } else {
      alert('Invalid Verification Code');
    }
  }

  statesChange(event) {
    this.districts = [];
    this.getDistricts(this.signUpForm.value.sign_state);
  }

  getStateList() {
    this.uTrackService.getStates().subscribe(response => {
      if (response.status) {
        this.states = response.data;
      }
    });
  }

  getDistricts(state_id) {
    this.uTrackService.getDistricts(state_id).subscribe(response => {
      if (response.status) {
        this.districts = response.data;
      }
    });
  }

  loginApiCall(mobile_number,password){

    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    const formData = new FormData();
    formData.append('mobile_number', mobile_number);
    formData.append('password',password);
    formData.append('user_type', 'Customer');
    formData.append('device_token', 'Web');

    this.http.post<LoginResponse>(environment.apiBaseUrl + 'user_login', formData, { headers }).subscribe(response => {
      if (response.status) {
        this.userData = response.data[0];
        this.uTrackService.USER_ID = this.userData.user_id;
        localStorage.setItem('USER_ID', this.userData.user_id);
        localStorage.setItem('FIRST_NAME', this.userData.first_name);
        localStorage.setItem('LAST_NAME', this.userData.last_name);
        localStorage.setItem('MOBILE_CODE', this.userData.mobile_code);
        localStorage.setItem('MOBILE', this.userData.mobile);
        localStorage.setItem('EMAIL', this.userData.email);
        localStorage.setItem('COMPNAY_LOGO', this.userData.company_logo);
        localStorage.setItem('COMPANY_NAME', this.userData.company_name);
        localStorage.setItem('REFERRAL_CODE', this.userData.referral_code);
        localStorage.setItem('REGISTERED_ID', this.userData.registered_by_id);
        localStorage.setItem("DASHBOARD_DISPLAY_TAB", this.userData.screen_name);
        localStorage.setItem('USER_TYPE', this.userData.user_type);
        if (this.userData.profile_image != null && this.userData.profile_image !== undefined
          && this.userData.profile_image !== '' && this.userData.profile_image !== 'https://www.pragatiutrack.com/uploads/no-image.png') {
          localStorage.setItem('PROFILE_IMAGE', this.userData.profile_image);
        } else {
          localStorage.setItem('PROFILE_IMAGE', 'assets/defaultpic.png');
        }


        let timerInterval;

        Swal.fire({
          icon: 'success',
          title: 'Pragati Utrack',
          html: response.message,
          timer: 2500,
          timerProgressBar: true,
          onBeforeOpen: () => {
            Swal.showLoading();
            timerInterval = setInterval(() => {
              const content = Swal.getContent();
              if (content) {
                const b = content.querySelector('b');
                if (b) {
                }
              }
            }, 100);
          },
          onClose: () => {
            clearInterval(timerInterval);
          },
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
          }
        });

        localStorage.setItem('LOGIN_MOBILE_NUMBER', mobile_number);
        localStorage.setItem('LOGIN_PASSWORD', password);

        if (this.isRemember) {
          localStorage.setItem('IS_REMEMBER', '1');
        } else {
          localStorage.setItem('IS_REMEMBER', '0');
        }

        switch(localStorage.getItem('DASHBOARD_DISPLAY_TAB')) { 
 
          case "Live Track": { 
            this.router.navigate(['web/livetrack']);
             break; 
          } 
          case "Track History": { 
            this.router.navigate(['web/track_history']);
             break; 
          } 
          case "Summary Report": { 
            this.router.navigate(['web/summary_report']);
             break; 
          } 
          case "Fuel Dashboard": { 
            this.router.navigate(['web/fuel_dashboard']);
             break; 
          } 
          case "Temperature Dashboard": { 
            this.router.navigate(['web/temperature_dashboard']);
             break; 
          } 
          case "Reports & Charts": { 
            this.router.navigate(['web/reports_charts']);
             break; 
          } 
          case "Fleet Management": { 
            this.router.navigate(['web/fleet-management']);
             break; 
          }
          default: { 
            this.router.navigate(['web']);
             break; 
          } 
       } 
      

      } else {

        let timerInterval;

        Swal.fire({
          icon: 'error',
          title: 'Pragati Utrack',
          html: response.message,
          timer: 2000,
          timerProgressBar: true,
          onBeforeOpen: () => {
            Swal.showLoading();
            timerInterval = setInterval(() => {
              const content = Swal.getContent();
              if (content) {
                const b = content.querySelector('b');
                if (b) {

                }
              }
            }, 100);
          },
          onClose: () => {
            clearInterval(timerInterval);
          },
        }).then((result) => {

          if (result.dismiss === Swal.DismissReason.timer) {
          }
        });
      }
    });
  }

  login() {
this.loginApiCall(this.loginForm.value.number,this.loginForm.value.password);
  }

  continueAsGuest() {
    this.loginForm.value.number = '9966663333';
    this.loginForm.value.password = '123456';
    this.login();
  }

  ngOnDestroy(): void {
  }
}


