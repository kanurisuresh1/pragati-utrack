import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NbToastrService } from '@nebular/theme';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import { ChangeEmailRespones } from '../../../../@theme/components/Model/ChangeEmailRespones';
import { ChangeEmailActionResponse } from '../../../../@theme/components/Model/ChangeEmailActionResponse';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss']
})
export class ChangeEmailComponent implements OnInit {
  otp_verify_code: any;
  email_id: string
  constructor(private routes: Router, private http: HttpClient,
    private toasterService: NbToastrService,
    private modalService: NgbModal,
    private uTrackService: UtrackService,
    public dialog: MatDialog,
   ) {
  
     }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
  }

  changeEmail = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  })

  @ViewChild('resetcode') resetcode: ElementRef;

  changeEmailId: boolean = true;
  submit() {

    const formData = new FormData();
    formData.append('email', this.changeEmail.value.email);
    formData.append('user_id', localStorage.getItem("USER_ID"));
    formData.append('user_type', "Customer");
    formData.append('device_token', "Web");

    this.uTrackService.change_email(formData).subscribe(response => {
      if (response.status) {
        this.otp_verify_code = response.data.verify_code
        this.changeEmailId = false;
        // this.modalService.open(this.resetcode)// Opens a OTP Dialog
        this.email_id = response.message
        this.toasterService.danger(response.message, 'Pragati Utrack')
        // this.dialog.closeAll()
      } else {
        this.toasterService.danger(response.message, 'Pragati Utrack')
      }
    })

  }

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
      'background-color': 'white'
    }
  };

  onOtpChange(otp) {
    this.otp = otp;
  }

  changeEmailAddress() {

    if (this.otp_verify_code == this.otp) {

      const formData = new FormData();
      formData.append('email', this.changeEmail.value.email);
      formData.append('user_id', localStorage.getItem("USER_ID"));
      formData.append('user_type', "Customer");
      formData.append('device_token', "Web");

      this.uTrackService.change_email_action(formData).subscribe(response => {
        if (response.status) {
          this.toasterService.success(response.message, 'Pragati Utrack')
          this.dialog.closeAll()
        } else {
          this.toasterService.danger(response.message, 'Pragati Utrack')
        }
      })
    } else {
      alert('OTP Verification Code does not match')
    }

  }
}
