import { Component, OnInit, ViewChild} from '@angular/core';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { VehicleList} from '../../../../@theme/components/Model/HubManagementResponse';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'ngx-hub-details',
  templateUrl: './hub-details.component.html',
  styleUrls: ['./hub-details.component.scss']
})
export class HubDetailsComponent implements OnInit {
  hubId: string;
  hubName: string;
  hubLocation: string;
  hubManager: string;
  hubManagerNum: string;

  ELEMENT_DATA: VehicleList[] = [];
  displayedColumns: string[] = ['id', 'vehicle_number', 'vehicle_type',];
  dataSource = new MatTableDataSource<VehicleList>(this.ELEMENT_DATA)

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private uTrackService: UtrackService,
    private headerService: HeaderInteractorService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.hubId = params.hub_id;
    })
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Hub Management Details')
    this.dataSource.sort = this.sort;
    this.fetchDataFromApi()
  }

  back() {
    this.location.back();
  }

  private filterValue = "";

  applyFilter(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filterValue = (event.target as HTMLInputElement).value;
      this.filterValue = this.filterValue.trim(); // Remove whitespace
      this.dataSource.filter = this.filterValue;
      this.fetchDataFromApi();
    }
  }

  search() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_element') as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue;
    this.fetchDataFromApi();
  }

  refresh() {
    this.fetchDataFromApi()
  }

  downloadPDF() {
    let doc = new jsPDF('landscape', 'pt', 'a4');
    doc.setFontSize(18);
    // doc.text('Customers', 11, 8);
    doc.setFontSize(11);
    doc.setTextColor(100);
    let customerTableColumn: string[] = ['ID', 'Vehicle Number', 'Vehicle Type'];
    let data: String[][] = [];

    let i = 1;
    this.ELEMENT_DATA.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number)
      row.push(value.vehicle_type)
      data.push(row);
      i++;
    }),
      (doc as any).autoTable(customerTableColumn, data)
    doc.save('HubDetails.pdf');
  }

  fetchDataFromApi() {
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    formData.append('user_type', localStorage.getItem('USER_TYPE'));
    formData.append('device_token', localStorage.getItem('Web'));
    formData.append('hub_id', this.hubId);

    this.uTrackService.hub_detail(formData).subscribe(response => {
      if (response.data != undefined && response.data != null && response.data.length > 0) {
        response.data.forEach(element => {
          this.hubName = element.hub_name
          this.hubLocation = element.hub_location
          this.hubManager = element.manager_name
          this.hubManagerNum = element.manager_number
          this.ELEMENT_DATA = element.vehicle_list
        })
        this.dataSource.data = this.ELEMENT_DATA;
      }
    })
  }
}
