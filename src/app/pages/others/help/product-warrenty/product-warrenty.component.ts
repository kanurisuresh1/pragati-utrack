import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { Location } from '@angular/common';

@Component({
  selector: 'ngx-product-warrenty',
  templateUrl: './product-warrenty.component.html',
  styleUrls: ['./product-warrenty.component.scss']
})
export class ProductWarrentyComponent implements OnInit {

  constructor(private headerService: HeaderInteractorService,private location : Location) { }

  ngOnInit(): void {
    this.headerService.updateHeaderTitle('HEADER_NAMES.Product Warranty')
  }

  back() {
    this.location.back();
  }
  

}
