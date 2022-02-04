import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { Location } from '@angular/common';

@Component({
  selector: 'ngx-services-and-reports',
  templateUrl: './services-and-reports.component.html',
  styleUrls: ['./services-and-reports.component.scss']
})
export class ServicesAndReportsComponent implements OnInit {

  constructor(private headerService: HeaderInteractorService,private location : Location) { }

  ngOnInit(): void {
    this.headerService.updateHeaderTitle('HEADER_NAMES.Services And Reports')
  }

  back() {
    this.location.back();
  }
  
}
