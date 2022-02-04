import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { Location } from '@angular/common';

@Component({
  selector: 'ngx-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {

  constructor(private headerService: HeaderInteractorService, private location: Location) { }

  ngOnInit(): void {
    this.headerService.updateHeaderTitle('HEADER_NAMES.Terms & Conditions')
  }

  back() {
    this.location.back();
  }

}
