import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { Location } from '@angular/common';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FAQSComponent implements OnInit {

  constructor(private headerService: HeaderInteractorService, private location: Location,
    private uTrackService: UtrackService) { }

  panelOpenState = false;


  ngOnInit(): void {
    this.headerService.updateHeaderTitle('HEADER_NAMES.Frequently Asked Questions')
    this.faq_customer_list();
  }


  back() {
    this.location.back();
  }

  FaqData = []

  faq_customer_list() {
    this.uTrackService.faq_customer_list().subscribe(response => {
      this.FaqData = response.data
    })
  }
}
