import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { Location } from '@angular/common';
import * as $ from 'jquery';


@Component({
  selector: 'ngx-industries',
  templateUrl: './industries.component.html',
  styleUrls: ['./industries.component.scss']
})
export class IndustriesComponent implements OnInit {
  
  constructor(private headerService: HeaderInteractorService,private location : Location) { }

  ngOnInit(): void {
    this.headerService.updateHeaderTitle('HEADER_NAMES.Industries')
  }

  back() {
    this.location.back();
  }

  showSelectedDiv(elementDivName, elementLinkName) {
    $('.section').hide();
    $('[data-name="' + elementDivName + '"]').fadeIn('slow').show();
    $('.widgetList').find('a').removeClass('selected');
    $('[data-name="' + elementLinkName + '"]').addClass('selected');
}


}
