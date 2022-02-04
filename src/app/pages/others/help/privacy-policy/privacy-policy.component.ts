import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { Location } from '@angular/common';

@Component({
  selector: 'ngx-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(private headerService: HeaderInteractorService,private location : Location) { }

  ngOnInit(): void {
    this.headerService.updateHeaderTitle('HEADER_NAMES.Privacy Policy')
  }

  back() {
    this.location.back();
  }
  

}
