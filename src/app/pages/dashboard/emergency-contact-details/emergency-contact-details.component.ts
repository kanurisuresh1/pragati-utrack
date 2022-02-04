import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NbToast, NbToastrService } from '@nebular/theme';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-emergency-contact-details',
  templateUrl: './emergency-contact-details.component.html',
  styleUrls: ['./emergency-contact-details.component.scss']
})
export class EmergencyContactDetailsComponent implements OnInit {
  deviceLinkId: string;
  constructor(@Inject(MAT_DIALOG_DATA) public deviceLink: any,
    private uTrackService: UtrackService, private toasterService: NbToastrService,
    public dialogRef: MatDialogRef<EmergencyContactDetailsComponent>,

  ) {

    this.deviceLinkId = JSON.parse(this.deviceLink.device_link_id);
  }

  ngOnInit(): void {
    this.customer_device_detail();
  }

  ec_name_1: string;
  ec_name_2: string;
  ec_name_3: string;
  emergency_contact_1: string;
  emergency_contact_2: string;
  emergency_contact_3: string;
  ec_sms_num_1: string;


  emergencyContactForm = new FormGroup({
    ecname1: new FormControl('', [Validators.required, Validators.minLength(3)]),
    ecnum1: new FormControl('', [Validators.required, Validators.minLength(10)]),
    ecname2: new FormControl(''),
    ecnum2: new FormControl(''),
    ecname3: new FormControl(''),
    ecnum3: new FormControl(''),
    ecmessage: new FormControl(''),
  })

  customer_device_detail() {
    this.uTrackService.customer_device_detail(this.deviceLinkId).subscribe(response => {
      if (response.status) {
        if (response.data != undefined && response.data != null && response.data.length > 0) {
          let emergencyDetailsData = response.data;
          emergencyDetailsData.forEach(val => {
            this.ec_name_1 = val.ec_name_1;
            this.ec_name_2 = val.ec_name_2;
            this.ec_name_3 = val.ec_name_3;
            this.emergency_contact_1 = val.emergency_contact_1;
            this.emergency_contact_2 = val.emergency_contact_2;
            this.emergency_contact_3 = val.emergency_contact_3;
            this.ec_sms_num_1 = val.ec_sms_num_1;

          })
        } else {
          this.ec_name_1 = '';
          this.ec_name_2 = '';
          this.ec_name_3 = '';
          this.emergency_contact_1 = '';
          this.emergency_contact_2 = '';
          this.emergency_contact_3 = '';
          this.ec_sms_num_1 = '';
        }
      } else {
        this.ec_name_1 = '';
        this.ec_name_2 = '';
        this.ec_name_3 = '';
        this.emergency_contact_1 = '';
        this.emergency_contact_2 = '';
        this.emergency_contact_3 = '';
        this.ec_sms_num_1 = '';
      }
    })
  }

  saveEmergency() {
    let ec_name_1 = this.emergencyContactForm.value.ecname1;
    let ec_name_2 = this.emergencyContactForm.value.ecname2;
    let ec_name_3 = this.emergencyContactForm.value.ecname3;
    let emergency_contact_1 = this.emergencyContactForm.value.ecnum1;
    let emergency_contact_2 = this.emergencyContactForm.value.ecnum2;
    let emergency_contact_3 = this.emergencyContactForm.value.ecnum3;
    let ec_sms_num_1 = this.emergencyContactForm.value.ecmessage;
    if (ec_name_1 != undefined && ec_name_1 != null
      && emergency_contact_1 != undefined && emergency_contact_1 != null && emergency_contact_1.length == 10
    ) {

      const formData = new FormData();
      formData.append('user_id', localStorage.getItem("USER_ID"));
      formData.append('user_type', localStorage.getItem("USER_TYPE"));
      formData.append('device_token', "Web");
      formData.append('device_link_id', this.deviceLinkId);
      formData.append('ec_name_1', ec_name_1);
      formData.append('ec_name_2', ec_name_2);
      formData.append('ec_name_3', ec_name_3);
      formData.append('emergency_contact_1', emergency_contact_1);
      formData.append('emergency_contact_2', emergency_contact_2);
      formData.append('emergency_contact_3', emergency_contact_3);
      formData.append('ec_sms_num_1', ec_sms_num_1);
      formData.append('ec_sms_num_2', '');
      formData.append('ec_sms_num_3', '');

      this.uTrackService.set_emergency_contact(formData).subscribe(response => {
        if (response.status) {
          this.toasterService.success(response.message, 'Pragati Utrack');
          this.customer_device_detail();
          this.dialogRef.close();
        } else {
          this.toasterService.danger(response.message, 'Pragati Utrack');
        }
      })

    }


  }
}
