import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerManagementDetails } from '../../../../@theme/components/Model/CustomerManagementDetails';
import { environment } from '../../../../../environments/environment';
import { NbToastrService } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'ngx-add-customer-management',
  templateUrl: './add-customer-management.component.html',
  styleUrls: ['./add-customer-management.component.scss']
})
export class AddCustomerManagementComponent implements OnInit {

  states = []
  state_id: string;
  isAddUser: boolean = true;
 
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  srcResult: string;

  profileImageUpload: File;
  sharedImageChangedEvent: any = '';
  croppedSharedImage: string = '';
  shared_user_image= "assets/images/MyWallet/defaultpic.png";

  public image: string;
  public full_name: string;
  public mobile_number: string;
  public email_id: string;
  public company_name: string;
  public stateId: string;
  public address_1: string;
  public address_2: string;
  public gst_num: string;

  isDisabled: boolean

  private customerData: CustomerManagementDetails
  constructor(@Inject(MAT_DIALOG_DATA) customerManagementDetails: CustomerManagementDetails,
    private uTrackService: UtrackService,
    private toast: NbToastrService,
    private modalService: NgbModal,
    private toasterService: NbToastrService,
  ) {
    if (customerManagementDetails != null)
      this.customerData = JSON.parse(customerManagementDetails.customer_id);
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    if (this.customerData != null && this.customerData != undefined) {
      this.isAddUser = false;
      this.isDisabled = true;
      this.full_name = this.customerData.full_name;
      this.mobile_number = this.customerData.mobile;
      this.email_id = this.customerData.email;
      this.company_name = this.customerData.company_name;
      this.stateId = this.customerData.state_id;
      this.address_1 = this.customerData.address1;
      this.address_2 = this.customerData.address2;
      this.gst_num = this.customerData.gst_number;
      this.shared_user_image = this.customerData.profile_image
    } else {
      this.isAddUser = true;
      this.isDisabled = false;
    }
    this.getStateList();
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


  createCustomerForm = new FormGroup({
    image: new FormControl(''),
    fullname: new FormControl('', [Validators.required, Validators.minLength(3)]),
    mobilenumber: new FormControl('', [Validators.required, Validators.minLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    companyName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    address1: new FormControl('', [Validators.required, Validators.minLength(3)]),
    address2: new FormControl('', [Validators.required, Validators.minLength(3)]),
    state: new FormControl('', [Validators.required]),
    gstNum: new FormControl('', [Validators.required, Validators.minLength(15)]),
  })

  getStateList() {
    this.uTrackService.getStates().subscribe(response => {
      if (response.status) {
        this.states = response.data
      }
    })
  }

  submit() {
    if (localStorage.getItem("MOBILE") == "9966663333") {
      this.toasterService.danger("Please login with your credentials to proceed, This is demo account.")
    } else {
      if (
        this.createCustomerForm.value.fullname != undefined && this.createCustomerForm.value.fullname != ""
        && this.createCustomerForm.value.mobilenumber != undefined && this.createCustomerForm.value.mobilenumber != ""
        && this.createCustomerForm.value.email != undefined && this.createCustomerForm.value.email != ""
        && this.createCustomerForm.value.state != undefined && this.createCustomerForm.value.state != ""
        && this.createCustomerForm.value.address1 != undefined && this.createCustomerForm.value.address1 != ""
        && this.createCustomerForm.value.gstNum != undefined && this.createCustomerForm.value.gstNum != ""
      ) {
        const headers = {
          'X-Api-Key': environment.X_API_KEY,
        }
        if (this.isAddUser) {
          const formData = new FormData();
          formData.append('user_id', localStorage.getItem('USER_ID'));
          formData.append('company_name', this.createCustomerForm.value.companyName);
          formData.append('user_type', localStorage.getItem("USER_TYPE"));
          formData.append('device_token', "Web");
          formData.append('full_name', this.createCustomerForm.value.fullname);
          formData.append('mobile', this.createCustomerForm.value.mobilenumber);
          formData.append('email', this.createCustomerForm.value.email);
          formData.append('state_id', this.createCustomerForm.value.state);
          formData.append('address1', this.createCustomerForm.value.address1);
          formData.append('address2', this.createCustomerForm.value.address2);
          formData.append('gst_number', this.createCustomerForm.value.gstNum);
  
          if (this.profileImageUpload != null && this.profileImageUpload != undefined) {
            formData.append('profile_image', this.profileImageUpload, this.profileImageUpload.name);
          }
  
          this.uTrackService.customer_add(formData).subscribe(response => {
            if (response.status) {
              this.toast.success('', response.message)
              this.image = "";
              this.full_name = ""
              this.mobile_number = ""
              this.email_id = ""
              this.company_name = ""
              this.stateId = ""
              this.address_1 = ""
              this.address_2 = ""
              this.gst_num = ""
              window.location.reload();
            } else {
              this.toast.danger('', response.message)
            }
          })
        } else {
          const formData = new FormData();
          formData.append('user_id', localStorage.getItem('USER_ID'));
          formData.append('company_name', this.createCustomerForm.value.companyName);
          formData.append('user_type', localStorage.getItem("USER_TYPE"));
          formData.append('device_token', "Web");
          formData.append('full_name', this.createCustomerForm.value.fullname);
          formData.append('mobile', this.customerData.mobile);
          formData.append('email', this.createCustomerForm.value.email);
          formData.append('state_id', this.createCustomerForm.value.state);
          formData.append('address1', this.createCustomerForm.value.address1);
          formData.append('address2', this.createCustomerForm.value.address2);
          formData.append('gst_number', this.createCustomerForm.value.gstNum);
          formData.append('customer_id', this.customerData.customer_id);
          formData.append('profile_image', this.profileImageUpload, this.profileImageUpload.name);

          this.uTrackService.customer_edit(formData).subscribe(response => {
            if (response.status) {
              this.toast.success('', response.message)
              window.location.reload();
            } else {
              this.toast.danger('', response.message)
            }
          })
        }
      } else {
        this.toast.danger('',"Please fill all mandatory Information.");
      }
    }
  }
  
}
