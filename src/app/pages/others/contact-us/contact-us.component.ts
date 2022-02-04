import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { ContactUsRespones } from '../../../@theme/components/Model/ContactUsRespones';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpEventType, HttpParams } from '@angular/common/http';
import swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  constructor(private headerService: HeaderInteractorService,
    private http: HttpClient, private location: Location,
    private toasterService: NbToastrService,
   private uTrackService:UtrackService) {
  
     }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Contact Us')
  }


  mobile_num = localStorage.getItem("MOBILE")
  email_id = localStorage.getItem("EMAIL")
  name = localStorage.getItem("FIRST_NAME") + ' ' + localStorage.getItem("LAST_NAME")
  subject: string
  description: string

  contactUsForm = new FormGroup({

    subject: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    mobile: new FormControl(''),
    email: new FormControl(''),
    name: new FormControl(''),

  })

  back() {
    this.location.back();
  }


  contactUs() {

    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    }
    const formData = new FormData();

    formData.append('user_id', localStorage.getItem("USER_ID"));

    formData.append('subject', this.contactUsForm.value.subject);
    formData.append('description', this.contactUsForm.value.description);


    this.http.post<ContactUsRespones>(environment.apiBaseUrl + 'contact_us_request', formData, { headers }).subscribe(response => {
      if (response.status) {

        this.toasterService.success('Pragati Utrack', response.message)
        this.subject = "";
        this.description = "";

      } else {
        this.toasterService.danger('Pragati Utrack', response.message)


      }
    })

  }

}
