import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { Location } from '@angular/common';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {


  constructor(private headerService: HeaderInteractorService,
    private uTrackService: UtrackService, private location: Location,) { }

  ngOnInit(): void {
    this.uTrackService.isUserValid();

    this.headerService.updateHeaderTitle('Product Details')
  }

  back() {
    this.location.back()
  }
}
