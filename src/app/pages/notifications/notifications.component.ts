import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../@theme/components/Services/header-interactor.service';
import { Location } from '@angular/common';
import { UtrackService } from '../../@theme/components/Services/Utrack.service';
import { NotificationResponseData } from '../../@theme/components/Model/NotificationResponse';
import { DateUtils } from '../../@theme/components/Services/date_utils';

@Component({
  selector: 'ngx-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  NotificationListDataNotshow: boolean;
  notificatindate: string;
  notificationTime: string;

  private isLoadingApiData = false;

  constructor(
    private headerService: HeaderInteractorService,
    private location: Location,
    private uTrackService: UtrackService,
  ) { }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Notifications')
    this.getNotifocationList();
  }

  back() {
    this.location.back();
  }

  getNotifocationList() {
    this.page_index_tab1 = 0
    this.uTrackService.getNotifocationListDetails(this.page_index_tab1).subscribe(response => {
      if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
        this.NotificationListDataNotshow = false;
        this.NotificationList = response.data;
        this.NotificationList.forEach((row) => {
          row.notificatindate = DateUtils.getDisplayOnlyDate(row.added_date);
          row.notificationTime = DateUtils.getDisplayTimeSec(row.added_date);
        })
        this.page_index_tab1++;
      } else {
        this.NotificationListDataNotshow = true;
      }
    })
  }

  NotificationList: NotificationResponseData[] = []
  private page_index_tab1 = 0;
  private haveNextPageDataTab1 = true;

  onTableScroll(e) {
    const tableViewHeight = e.target.offsetHeight
    const tableScrollHeight = e.target.scrollHeight
    const scrollLocation = e.target.scrollTop;
    const buffer = 100;
    const limit = tableScrollHeight - tableViewHeight - buffer;

    if (scrollLocation > limit) {
      if (!this.isLoadingApiData && this.haveNextPageDataTab1) {
        this.isLoadingApiData = true
        this.uTrackService.getNotifocationListDetails(this.page_index_tab1.toString()).subscribe(response => {
          if (response.status) {
            if (response.data != null && response.data != undefined && response.data.length > 0) {
              this.NotificationList = response.data;
              this.NotificationList.forEach((row) => {
                row.notificatindate = DateUtils.getDisplayOnlyDate(row.added_date);
                row.notificationTime = DateUtils.getDisplayTimeSec(row.added_date);
              })
              this.isLoadingApiData = false;
              this.page_index_tab1++;
            }
          } else {
            this.isLoadingApiData = false;
            this.haveNextPageDataTab1 = false;
          }
        })
      }
    }
  }

}
