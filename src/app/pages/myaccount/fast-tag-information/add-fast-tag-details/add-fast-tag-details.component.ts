import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { FastTagBanksResponseData } from '../../../../@theme/components/Model/FastTagBanksResponse';
import { FastTagDetailsResponseData } from '../../../../@theme/components/Model/FastTagDetailsResponse';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-add-fast-tag-details',
  templateUrl: './add-fast-tag-details.component.html',
  styleUrls: ['./add-fast-tag-details.component.scss']
})
export class AddFastTagDetailsComponent implements OnInit {

  constructor(private uTrackService: UtrackService,
   
    private toasterService: NbToastrService,
    @Inject(MAT_DIALOG_DATA) serviceManagementDetails: FastTagDetailsResponseData,
    public dialogRef: MatDialogRef<AddFastTagDetailsComponent>,

  ) {

    if (serviceManagementDetails != null) {
      this.fastTagServiceData = JSON.parse(serviceManagementDetails.fasttag_account_id)
    }

  }
  private fastTagServiceData: FastTagDetailsResponseData;

  ngOnInit(): void {

    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();

    if (this.fastTagServiceData != null && this.fastTagServiceData != undefined) {
      this.isAddFastTag = false;
      this.bank_id = this.fastTagServiceData.fasttag_bank_id;
      this.api_key = this.fastTagServiceData.fasttag_api_key
      this.status = this.fastTagServiceData.status
      this.api_client_id = this.fastTagServiceData.fasttag_api_client_id
      this.fasttag_account_id = this.fastTagServiceData.fasttag_account_id;
    } else {
      this.isAddFastTag = true;

    }
    this.get_fast_tag_bank_list();
  }

  isAddFastTag: boolean = true;
  status: string = 'Active';
  api_client_id: string;
  api_key: string;
  bank_id: string;
  fasttag_account_id: string;

  fastTagDetailsForm = new FormGroup({
    bank_id: new FormControl(''),
    api_key: new FormControl(''),
    api_client_id: new FormControl(''),
    status: new FormControl(''),

  })

  banks: FastTagBanksResponseData[] = [];

  get_fast_tag_bank_list() {
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    this.uTrackService.get_fast_tag_bank_list(formData).subscribe(response => {
      if (response.status) {
        this.banks = [];
        if (response.data != null && response.data != undefined && response.data.length > 0) {
          this.banks = response.data;
          this.bank_id = this.banks[0].fasttag_bank_id;
        }
      }
    })
  }
  submit() {

    let bank_id = this.fastTagDetailsForm.value.bank_id;
    let fast_tag_api_key = this.fastTagDetailsForm.value.api_key;
    let fast_tag_client_id = this.fastTagDetailsForm.value.api_client_id;
    let status = this.fastTagDetailsForm.value.status

    if (bank_id == undefined || bank_id == null) {
      bank_id = '';
    }

    if (fast_tag_api_key == undefined || fast_tag_api_key == null) {
      fast_tag_api_key = '';
    }

    if (fast_tag_client_id == undefined || fast_tag_client_id == null) {
      fast_tag_client_id = '';
    }

    if (status == undefined || status == null) {
      status = '';
    }
    if (this.isAddFastTag) {
      const formData = new FormData();
      formData.append('user_id', localStorage.getItem('USER_ID'));
      formData.append('device_token', "Web");
      formData.append('fasttag_bank_id', bank_id);
      formData.append('fasttag_api_key', fast_tag_api_key);
      formData.append('fasttag_api_client_id', fast_tag_client_id);
      formData.append('status', status);

      this.uTrackService.add_fast_tag_account(formData).subscribe(response => {
        if (response.status) {
          this.toasterService.success('Pragati Utrack', response.message)
          this.dialogRef.close()
        } else {
          this.toasterService.danger('Pragati Utrack', response.message)

        }
      })

    } else {
      const formData = new FormData();
      formData.append('user_id', localStorage.getItem('USER_ID'));
      formData.append('device_token', "Web");
      formData.append('fasttag_bank_id', bank_id);
      formData.append('fasttag_api_key', fast_tag_api_key);
      formData.append('fasttag_api_client_id', fast_tag_client_id);
      formData.append('status', status);
      formData.append('fasttag_account_id', this.fasttag_account_id);

      this.uTrackService.edit_fast_tag_account(formData).subscribe(response => {
        if (response.status) {
          this.toasterService.success('Pragati Utrack', response.message)
          this.dialogRef.close();
        } else {
          this.toasterService.danger('Pragati Utrack', response.message)

        }
      })

    }


  }
}
