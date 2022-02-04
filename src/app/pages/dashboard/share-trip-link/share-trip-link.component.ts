import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NbToastrService } from '@nebular/theme';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';


@Component({
  selector: 'ngx-share-trip-link',
  templateUrl: './share-trip-link.component.html',
  styleUrls: ['./share-trip-link.component.scss']
})
export class ShareTripLinkComponent implements OnInit {

  sharelinkid: string;
  vehicle_number: string;

  mobileNotificationForm: FormGroup;
  num_submitted = false;

  emailNotificationForm: FormGroup;
  email_submitted = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, @Inject(MAT_DIALOG_DATA) public vehicle_num: any,
    private formBuilder: FormBuilder,
    private uTrackService: UtrackService,
    private toasterService: NbToastrService) {
    this.sharelinkid = JSON.parse(this.data.dataKey);
    this.vehicle_number = JSON.parse(this.vehicle_num.vehicle_num);
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.sharelinkid = this.data.dataKey.replace(/["']/g, "");

    this.emailNotificationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    });

    this.mobileNotificationForm = this.formBuilder.group({
      mobileNumber: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  get f() { return this.mobileNotificationForm.controls; }
  get e() { return this.emailNotificationForm.controls; }

  mobile_notification() {
    this.num_submitted = true;
    if (!this.mobileNotificationForm.invalid) {

      const formData = new FormData();
      formData.append('user_id', localStorage.getItem("USER_ID"));
      formData.append('user_type', localStorage.getItem("USER_TYPE"));
      formData.append('device_token', "Web");
      formData.append('type', 'Mobile');
      formData.append('content', 'Your consigment shipped through Vehicle No : ' + this.vehicle_number + '\n'
        + 'Can be tracked Live on Map.' + '\n' + 'Click Here to view : ' + this.sharelinkid);
      formData.append('email', 'test@mail.com');
      formData.append('mobile', this.mobileNotificationForm.value.mobileNumber);

      this.uTrackService.share_live_link(formData).subscribe(response => {
        if (response.status) {
          this.toasterService.success(response.message, 'Pragati Utrack')
        }
      })

    } else {
      return;
    }
  }

  email_notification() {
    this.email_submitted = true;

    if (!this.emailNotificationForm.invalid) {
      const formData = new FormData();
      formData.append('user_id', localStorage.getItem("USER_ID"));
      formData.append('user_type', localStorage.getItem("USER_TYPE"));
      formData.append('device_token', "Web");
      formData.append('type', 'Email');
      formData.append('content', 'Your consigment shipped through Vehicle No : ' + this.vehicle_number + '\n'
        + 'Can be tracked Live on Map.' + '\n' + 'Click Here to view : ' + this.sharelinkid);
      formData.append('mobile', '9999999999');
      formData.append('email', this.emailNotificationForm.value.email);

      this.uTrackService.share_live_link(formData).subscribe(response => {
        if (response.status) {
          this.toasterService.success(response.message, 'Pragati Utrack')
        }
      })

    } else {
      return;
    }
  }

  public openNewtab() {
    window.open(this.sharelinkid, '_blank')
  }

  public copyToClipboard() {

    var el = document.getElementById('inputId');
    el.setAttribute('contenteditable', 'true');
    el.focus();
    document.execCommand('selectAll');
    document.execCommand('copy');
    el.setAttribute('contenteditable', 'false');
    el.blur();
  }

}
