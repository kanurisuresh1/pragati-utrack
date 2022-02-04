import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  constructor(private headerService: HeaderInteractorService,
    private uTrackService: UtrackService) {
    
     }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Help')
    this.contact_info_settings();
  }

  youtube_refernce: string

  contact_info_settings() {
    this.uTrackService.contact_info_settings().subscribe(response => {
      this.youtube_refernce = response.data.youtube_how_to_use
    })
  }


}
