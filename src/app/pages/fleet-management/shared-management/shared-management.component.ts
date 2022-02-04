import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NbToastrService } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HomeLiteV1Data } from '../../../@theme/components/Model/HomeLiteV1Response';
import { SharedManagementListRepsonseData } from '../../../@theme/components/Model/SharedManagementListResponse';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { ShareTripLinkComponent } from '../../dashboard/share-trip-link/share-trip-link.component';

@Component({
  selector: 'ngx-shared-management',
  templateUrl: './shared-management.component.html',
  styleUrls: ['./shared-management.component.scss']
})
export class SharedManagementComponent implements OnInit {

  TableDataNotshow: boolean;

  constructor(private headerService: HeaderInteractorService,
    private uTrackService: UtrackService,
    private toasterService: NbToastrService,
    private location: Location,
    private modalService: NgbModal,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Shared Link Management');
    this.getVehicles();
  }

  back() {
    this.location.back();
  }

  sharedData: SharedManagementListRepsonseData[] = [];

  ELEMENT_DATA: SharedManagementListRepsonseData[] = [];
  displayedColumns: string[] = ['user_id', 'vehicle_number', 'vehicle_type', 'share_code', 'type', 'time_created', 'modified_date', 'live_duration', 'status', 'action', 'share_url'];
  dataSource = new MatTableDataSource<SharedManagementListRepsonseData>(this.ELEMENT_DATA)

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  isActive: boolean = false;
  isInActive: boolean = false;
  isExpired: boolean = false;

  shared_links_list() {
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem("USER_ID"))
    formData.append('device_token', 'Web')
    formData.append('user_type', localStorage.getItem("USER_TYPE"))

    if (this.changed_device_link_id == undefined) {
      this.changed_device_link_id = this.deviceLinkId
    } else {
      this.changed_device_link_id = this.changed_device_link_id
    }

    formData.append('device_link_id', this.changed_device_link_id)

    this.uTrackService.shared_links_list(formData).subscribe(response => {
      this.ELEMENT_DATA = [];
      if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
        this.TableDataNotshow = false;
        this.sharedData = response.data
        for (let data of this.sharedData) {
          if (data.status == "Expired") {
            data.status_type_converted = "Extend Time"
            data.status_type_button_color = "#0e918c"
          }
          if (data.status == "Inprogress" || data.status == "active" || data.status == "Active" || data.status == "Activate") {
            data.status_type_converted = "Inactivate"
            data.status_type_button_color = "red"
          }
          if (data.status == "In Active" || data.status == "InActive" || data.status == "Inactive" || data.status == "Inactivate") {
            data.status_type_converted = "Activate"
            data.status_type_button_color = "green"
          }
        }
        this.ELEMENT_DATA = response.data
      } else {
        this.TableDataNotshow = true;
      }
      this.dataSource.data = this.ELEMENT_DATA;
    })
  }

  vehicles: HomeLiteV1Data[] = [];
  deviceLinkId: string
  vehicle_number: string
  getVehicles() {
    this.uTrackService.home_lite_v1().subscribe(response => {
      if (response.data != null && response.data != undefined && response.data.length > 0) {
        this.TableDataNotshow = false;
        this.vehicles = response.data
        this.deviceLinkId = this.vehicles[0].device_link_id;
        this.vehicle_number = this.vehicles[0].vehicle_number;
        this.shared_links_list();
      } else {
        this.TableDataNotshow = true;
      }
    })
  }

  changed_device_link_id: any;
  updateSelectedValue(row) {
    this.changed_device_link_id = row.device_link_id;
    this.vehicle_number = row.vehicle_number;
    this.shared_links_list();
  }

  getAll() {
    this.changed_device_link_id = '0';
    this.vehicle_number = '';
    this.shared_links_list();
  }

  @ViewChild('extend_time') extend_time: ElementRef;
  shareTimeForm = new FormGroup({
    shareTime: new FormControl(''),
  });

  defaultTime = 60;
  extend_status_type: any;
  shareUrl() {
    var extend_mins = this.shareTimeForm.value.shareTime
    this.extend_share_link_expire_time(this.extend_status_type, extend_mins)
  }

  share(element) {
    let dialogReference = this.dialog.open(ShareTripLinkComponent, {
      height: '45%',
      width: '55%',
      data: {
        dataKey: JSON.stringify('https://track.pragatiutrack.com/tripshare/' + element.share_code),
        vehicle_num: JSON.stringify(this.vehicle_number)
      }
    })
    dialogReference.afterClosed().subscribe(result => {
      dialogReference.close()
    })
  }

  status_change(element) {
    if (element.status == "Active") {
      element.status_type_converted = "Inactive"
      this.share_link_status_change(element.status_type_converted, element.trip_share_id)
    }

    if (element.status == "Inactivate" || element.status == "Inactive") {
      element.status_type_converted = "Active"
      this.share_link_status_change(element.status_type_converted, element.trip_share_id)
    }

    if (element.status == "Expired") {
      this.extend_status_type = element.status_type_converted
      this.modalService.open(this.extend_time)
    }
  }

  share_link_status_change(status, trip_share_id) {
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem("USER_ID"))
    formData.append('device_token', 'Web')
    formData.append('user_type', localStorage.getItem("USER_TYPE"))

    if (this.changed_device_link_id == undefined) {
      this.changed_device_link_id = this.deviceLinkId
    } else {
      this.changed_device_link_id = this.changed_device_link_id
    }

    formData.append('device_link_id', this.changed_device_link_id)
    formData.append('trip_share_id', trip_share_id)
    formData.append('status', status)

    this.uTrackService.share_link_status_change(formData).subscribe(response => {
      if (response.status) {
        this.shared_links_list();
        this.toasterService.info(response.message, 'Pragati Utrack')
      }
    })

  }

  extend_share_link_expire_time(extend_mins, trip_share_id) {
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem("USER_ID"))
    formData.append('device_token', 'Web')
    formData.append('user_type', localStorage.getItem("USER_TYPE"))

    if (this.changed_device_link_id == undefined) {
      this.changed_device_link_id = this.deviceLinkId
    } else {
      this.changed_device_link_id = this.changed_device_link_id
    }

    formData.append('device_link_id', this.changed_device_link_id)
    formData.append('trip_share_id', trip_share_id)
    formData.append('extend_mins', extend_mins)

    this.uTrackService.extend_share_link_expire_time(formData).subscribe(response => {
      if (response.status) {
        this.shared_links_list();
        this.toasterService.info(response.message, 'Pragati Utrack')
        this.modalService.dismissAll('Closed')
      }
    })
  }

}
