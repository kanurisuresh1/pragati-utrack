import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { NbToastrService } from '@nebular/theme';
import { AddTripExpensesResponse } from '../../../../@theme/components/Model/AddTripExpensesResponse';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
export const MY_FORMATS = {
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};


@Component({
  selector: 'ngx-add-other-expenses',
  templateUrl: './add-other-expenses.component.html',
  styleUrls: ['./add-other-expenses.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],

})
export class AddOtherExpensesComponent implements OnInit {

  todayDate: Date = new Date();
  pipe = new DatePipe('en-US');
  expensesReceiptImage: File = null;

  constructor(
    private location: Location,
    private toasterService: NbToastrService,
    private http: HttpClient,
    private uTrackService:UtrackService
  ) {

   }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
  }

  otherExpensesReportForm = new FormGroup({
    expensesDate: new FormControl(''),
    expensesType: new FormControl(''),
    expensesAmount: new FormControl(''),
    expensesnotes: new FormControl(''),
    fileData: new FormControl(''),

  })

  uploadServiceImage(files: FileList) {
    this.expensesReceiptImage = files.item(0);
    let reader = new FileReader();
    if (this.expensesReceiptImage != null && this.expensesReceiptImage != undefined) {
      reader.readAsDataURL(this.expensesReceiptImage);
    }
  }

  submit() {

    if (
      this.otherExpensesReportForm.value.expensesDate != undefined && this.otherExpensesReportForm.value.expensesDate != ""
      && this.otherExpensesReportForm.value.expensesType != undefined && this.otherExpensesReportForm.value.expensesType != ""
      && this.otherExpensesReportForm.value.expensesAmount != undefined && this.otherExpensesReportForm.value.expensesAmount != ""
      && this.otherExpensesReportForm.value.expensesnotes != undefined && this.otherExpensesReportForm.value.expensesnotes != ""
    ) {


      const headers = {
        'X-Api-Key': environment.X_API_KEY,
      }
      
        const formData = new FormData();
        formData.append('user_id', localStorage.getItem('USER_ID'));
        formData.append('expense_type', this.otherExpensesReportForm.value.expensesType);
        formData.append('device_token', "Web");
        formData.append('expense_date', this.pipe.transform(this.otherExpensesReportForm.value.expensesDate, 'yyyy-MM-dd'));
        formData.append('amount', this.otherExpensesReportForm.value.expensesAmount);
        formData.append('expense_notes', this.otherExpensesReportForm.value.expensesnotes);
        formData.append('receipt_image',this.otherExpensesReportForm.value.fileData);
        formData.append('trip_id',localStorage.getItem('TRIP_ID'));

        this.http.post<AddTripExpensesResponse>(environment.apiBaseUrl + 'trip_expense_add', formData, { headers }).subscribe(response => {
          if (response.status) {
    
            this.toasterService.success('Pragati Utrack', response.message)
              window.location.reload();
    
          } else {
    
            this.toasterService.danger('Pragati Utrack', response.message)
    
          }
        })

    } else {
      alert("Please fill all mandatory Information.");
    }

  }

}
