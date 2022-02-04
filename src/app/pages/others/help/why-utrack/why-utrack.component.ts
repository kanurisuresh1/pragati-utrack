import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { Location } from '@angular/common';

@Component({
  selector: 'ngx-why-utrack',
  templateUrl: './why-utrack.component.html',
  styleUrls: ['./why-utrack.component.scss']
})
export class WhyUtrackComponent implements OnInit {

  constructor(private headerService : HeaderInteractorService,private location : Location) { }

  ngOnInit(): void {
    this.headerService.updateHeaderTitle('HEADER_NAMES.Why Utrack?')
  }

  back() {
    this.location.back();
  }
  
}
