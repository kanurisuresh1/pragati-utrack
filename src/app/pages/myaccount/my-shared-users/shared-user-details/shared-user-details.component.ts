import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { NbToastrService } from '@nebular/theme';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { DriverManagementListData } from '../../../../@theme/components/Model/DriverManagementList';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SharedUsersResponseDetailsData } from '../../../../@theme/components/Model/SharedUsersResponseDetails';
import { ThemePalette } from '@angular/material/core';
import { elementAt } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-shared-user-details',
  templateUrl: './shared-user-details.component.html',
  styleUrls: ['./shared-user-details.component.scss']
})
export class SharedUserDetailsComponent implements OnInit {

  other_user_id: any;
  color: ThemePalette = 'accent';

  ELEMENT_DATA: SharedUsersResponseDetailsData[] = [];

  displayedColumns: string[] = ['user_id', 'vehicle_number', 'vehicle_type', 'Assigned',];
  dataSource = new MatTableDataSource<SharedUsersResponseDetailsData>(this.ELEMENT_DATA)
  TableDataNotshow:boolean;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("content") content: ElementRef;


  constructor(private uTrackService: UtrackService,
    private location: Location, private toasterService: NbToastrService,
    private headerService: HeaderInteractorService,
    private activatedRoute: ActivatedRoute, private http: HttpClient,

  ) {
    this.activatedRoute.params.subscribe(params => {
      this.other_user_id = params.user_id;
    });
   
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Shared User Details');
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getSharedUserDetails();
  }

  public toggle(event, device_link_id) {
    if (event.checked) {
      const formData = new FormData();
      formData.append('user_id', localStorage.getItem('USER_ID'));
      formData.append('user_type', localStorage.getItem('USER_TYPE'));
      formData.append('device_token', "Web");
      formData.append('other_user_id', this.other_user_id);
      formData.append('device_link_id', device_link_id);
      this.uTrackService.assign_user_to_device(formData).subscribe(response => {
        this.toasterService.success('Pragati Utrack', response.message)
        this.getSharedUserDetails();
      })
    } else {
      const formData = new FormData();
      formData.append('user_id', localStorage.getItem('USER_ID'));
      formData.append('user_type', localStorage.getItem('USER_TYPE'));
      formData.append('device_token', "Web");
      formData.append('other_user_id', this.other_user_id);
      formData.append('device_link_id', device_link_id);
      this.uTrackService.remove_device_users(formData).subscribe(response => {
        this.toasterService.success('Pragati Utrack', response.message)
        this.getSharedUserDetails();
      })
    }
  }

  back() {
    this.location.back()
  }

  private filterValue = "";

  applyFilter(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filterValue = (event.target as HTMLInputElement).value;
      this.filterValue = this.filterValue.trim(); // Remove whitespace
      this.dataSource.filter = this.filterValue;
      this.getSharedUserDetails();
    }
  }

  refresh() {
    this.getSharedUserDetails()
  }

  search() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_element') as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue;
    this.getSharedUserDetails();
  }


  getSharedUserDetails() {
    this.uTrackService.user_managed_device_list(this.other_user_id).subscribe(response => {
      this.ELEMENT_DATA = []
      if (response.status) {
        if (response.data != null && response.data != undefined && response.data.length > 0) {
          this.TableDataNotshow = false;
          response.data.forEach(element => {
            this.ELEMENT_DATA.push(element)
            element.checked = (1 == element.is_device_assigned)
          })
        } else {
          this.TableDataNotshow = true;
        }
      } else {
        this.TableDataNotshow = true;
      }
      this.dataSource.data = this.ELEMENT_DATA
    })
  }

  downloadPDF() {

  }

}
