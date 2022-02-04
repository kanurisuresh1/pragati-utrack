import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { Router} from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { HomeData } from '../../../@theme/components/Model/Home';
import { OpenDetailsComponent } from '../../dashboard/open-details/open-details.component';

@Component({
  selector: 'ngx-driver-management',
  templateUrl: './driver-management.component.html',
  styleUrls: ['./driver-management.component.scss']
})
export class DriverManagementComponent implements OnInit {

  ELEMENT_DATA: HomeData[] = [];
  driverDetails = [];

  displayedColumns: string[] = ['device_id', 'vehicle_number', 'driver_details'];
  dataSource = new MatTableDataSource<HomeData>(this.ELEMENT_DATA)

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  TableDataNotshow: boolean;

  constructor(private uTrackService: UtrackService,
    private headerService: HeaderInteractorService,
    private location: Location,
    private routes: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Driver Management')
    this.my_users_list();
  }

  openDriverList() {
    this.routes.navigate(["web/fleet-management/driver-management/driver-list"]);
  }


  fetchDataFromApi() {
    this.uTrackService.getHomeWebService().subscribe(response => {
      this.ELEMENT_DATA = []
      if (response.status && response.data != undefined && response.data != null && response.data.length > 0) {
        this.TableDataNotshow = false;
        this.ELEMENT_DATA = response.data
        response.data.forEach(val => {
          val.temp_driver_id = val.driver_id
        })
      } else {
        this.TableDataNotshow = true;
      }
      this.dataSource.data = this.ELEMENT_DATA;
    })
  }

  my_users_list() {
    this.uTrackService.my_users_list().subscribe(response => {
      if (response.data != undefined && response.data != null && response.data.length > 0) {
        this.TableDataNotshow = false;
        this.driverDetails = response.data
        this.fetchDataFromApi();
      }
      else {
        this.TableDataNotshow = true;
      }
    })
  }

  onSelectDriver(element) {
    if ("-1" == element.driver_id) {
      const formData = new FormData();
      formData.append('user_id', localStorage.getItem('USER_ID'));
      formData.append('user_type', localStorage.getItem('USER_TYPE'));
      formData.append('device_token', "Web");
      formData.append('device_link_id', element.device_link_id);
      formData.append('driver_id', element.temp_driver_id);
      this.uTrackService.remove_driver_from_vehicle(formData).subscribe(response => {
        alert(response.message);
        this.fetchDataFromApi();
      })
    } else {
      const formData = new FormData();
      formData.append('user_id', localStorage.getItem('USER_ID'));
      formData.append('user_type', localStorage.getItem('USER_TYPE'));
      formData.append('device_token', "Web");
      formData.append('device_link_id', element.device_link_id);
      formData.append('driver_id', element.driver_id);
      this.uTrackService.assign_driver_to_vehicle(formData).subscribe(response => {
        alert(response.message);
        this.fetchDataFromApi();
      })
    }
  }

  back() {
    this.location.back();
  }

  openDetails(model_data: HomeData) {
    const rowData = JSON.stringify(model_data);
    const dialogReference = this.dialog.open(OpenDetailsComponent, {
      disableClose: true,
      data: { vehicle_number: rowData },
    });
    dialogReference.afterClosed().subscribe(() => {
      dialogReference.close();
    });
  }

}
