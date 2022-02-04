import { Component, OnInit } from '@angular/core';
import { ChangePasswordResponse } from '../../../../@theme/components/Model/ChangePasswordResopnse';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NbToastrService } from '@nebular/theme';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  constructor(private routes: Router, private http: HttpClient,
    public snackBar: MatSnackBar, private uTrackService: UtrackService,
    private toasterService: NbToastrService) { }

  ngOnInit(): void {
    if (localStorage.getItem("USER_ID") == null || localStorage.getItem("USER_ID") == "") {
      this.routes.navigate(["/login"]);
    }
  }

  changepassword = new FormGroup({
    oldpassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    newpassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmpassword: new FormControl('', [Validators.required, Validators.minLength(6)]),

  })

  submit() {
    if (this.changepassword.value.oldpassword == this.changepassword.value.newpassword) {
      this.toasterService.danger("Old Password and New Password Should not be same.")
    } else if (this.changepassword.value.newpassword != this.changepassword.value.confirmpassword) {
      this.toasterService.danger("New Password and Confirm Password Should be same.")
    } else {
      const formData = new FormData();

      formData.append('old_password', this.changepassword.value.oldpassword);
      formData.append('new_password', this.changepassword.value.newpassword);
      formData.append('user_id', localStorage.getItem("USER_ID"));
      formData.append('device_token', localStorage.getItem("USER_TYPE"));

      this.uTrackService.change_password(formData).subscribe(response => {
        if (response.status) {
          this.toasterService.success("Pragati Utrack", response.message,);

        } else {
          this.toasterService.danger("Pragati Utrcak", response.message,);
        }
      })
    }
  }

}
