import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { NbToastrService } from '@nebular/theme';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import { ChangeNumberResponse } from '../../../../@theme/components/Model/ChangeNumberResponse';
import { ChangeMobileActionResponse } from '../../../../@theme/components/Model/ChangeMobileActionResponse';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-change-number',
  templateUrl: './change-number.component.html',
  styleUrls: ['./change-number.component.scss']
})
export class ChangeNumberComponent implements OnInit {
  otp_verify_code: any;
  changeValue: any;
  changeNumber: boolean = true;
  constructor(private routes: Router,
    private http: HttpClient, private uTrackService: UtrackService,
    private toasterService: NbToastrService,
    private modalService: NgbModal, public dialog: MatDialog,
 
  ) { 
  
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
  }

  changenumber = new FormGroup({
    phonenumber: new FormControl('', [Validators.required, Validators.minLength(10)]),
  })


  @ViewChild('resetcode') resetcode: ElementRef;

  mobile_number: any

  submit() {

    const formData = new FormData();
    formData.append('mobile', this.changenumber.value.phonenumber);
    formData.append('user_id', localStorage.getItem("USER_ID"));
    formData.append('user_type', localStorage.getItem("USER_TYPE"));
    formData.append('device_token', "Web");

    this.uTrackService.change_mobile(formData).subscribe(response => {
      if (response.status) {
        this.otp_verify_code = response.data.verify_code
        this.mobile_number = response.message
        this.changeNumber = false;
        // this.modalService.open(this.resetcode) // Opens a OTP Dialog
        this.toasterService.success(response.message, 'Pragati Utrack')
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


  changephoneNumber() {
    if (this.otp_verify_code == this.otp) {

      const formData = new FormData();
      formData.append('mobile', this.changenumber.value.phonenumber);
      formData.append('user_id', localStorage.getItem("USER_ID"));
      formData.append('user_type', localStorage.getItem("USER_TYPE"));
      formData.append('device_token', "Web");

      this.uTrackService.change_mobile_action(formData).subscribe(response => {
        if (response.status) {
          this.dialog.closeAll()
          this.toasterService.success('Pragati Utrack', response.message)
        } else {
          this.toasterService.danger('Pragati Utrack', response.message)
        }
      })
    } else {
      alert('OTP Verification Code does not match')
    }


  }

}
