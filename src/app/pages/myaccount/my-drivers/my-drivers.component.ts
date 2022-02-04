import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';

@Component({
  selector: 'ngx-my-drivers',
  templateUrl: './my-drivers.component.html',
  styleUrls: ['./my-drivers.component.scss']
})
export class MyDriversComponent implements OnInit {

  constructor(private headerService : HeaderInteractorService) { }

  ngOnInit(): void {
    this.headerService.updateHeaderTitle('HEADER_NAMES.My Drivers')
  }
}
