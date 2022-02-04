import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';

@Component({
  selector: 'ngx-bus-notifications',
  templateUrl: './bus-notifications.component.html',
  styleUrls: ['./bus-notifications.component.scss']
})
export class BusNotificationsComponent implements OnInit {

  constructor(private headerService: HeaderInteractorService) { }

  ngOnInit(): void {
    this.headerService.updateHeaderTitle('Notifications')
  }

}
