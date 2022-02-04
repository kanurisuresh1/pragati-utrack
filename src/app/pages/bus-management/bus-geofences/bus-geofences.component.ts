import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BusGeofenceListResponseData } from '../../../@theme/components/Model/BusGeofenceListResponse';
import { BusOrganisationBranchListResponseData } from '../../../@theme/components/Model/BusOrganisationBranchListResponse';
import { BusOrganisationsListResponseData } from '../../../@theme/components/Model/BusOrganisationsListResponse';
import { CustomerManagementDetails } from '../../../@theme/components/Model/CustomerManagementDetails';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-bus-geofences',
  templateUrl: './bus-geofences.component.html',
  styleUrls: ['./bus-geofences.component.scss']
})
export class BusGeofencesComponent implements OnInit {
  constructor(private headerService: HeaderInteractorService,
    private routes: Router,
    private uTrackService: UtrackService,
  ) { }

  ngOnInit(): void {
    this.headerService.updateHeaderTitle('Geofences');
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.bus_geofence_list();
  }

  ELEMENT_DATA: BusGeofenceListResponseData[] = [];
  displayedColumns: string[] = ['id', 'geofence_name', 'latitude', 'longitude', 'location_name', 'radius', 'added_date', 'modified_date', 'status', 'edit'];
  dataSource = new MatTableDataSource<BusGeofenceListResponseData>(this.ELEMENT_DATA)

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("content") content: ElementRef;

  TableDataNotshow: boolean = false;

  bus_geofence_list() {
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    this.uTrackService.bus_geofence_list(formData).subscribe(response => {
      if (response.status) {
        if (response.data != null && response.data != undefined && response.data.length > 0) {
          this.ELEMENT_DATA = response.data;
          this.dataSource.data = this.ELEMENT_DATA;
          this.TableDataNotshow = false;
        } else {
          this.TableDataNotshow = true;
        }
      } else {
        this.TableDataNotshow = true;
      }
    })
  }

  organisation_list: BusOrganisationsListResponseData[] = [];
  org_name: string;

  bus_organisation_list() {

    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));

    this.uTrackService.bus_organisation_list(formData).subscribe(response => {
      if (response.status) {
        if (response.data != null && response.data != undefined && response.data.length > 0) {
          this.organisation_list = response.data;
          this.org_name = this.organisation_list[0].bus_organisation_id
        }
      }
    })
  }

  branch_organisation_list: BusOrganisationBranchListResponseData[] = [];
  branch_org_name: string;

  bus_organisation_branch_list() {

    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    this.uTrackService.bus_organisation_branch_list(formData).subscribe(response => {
      if (response.status) {
        if (response.data != null && response.data != undefined && response.data.length > 0) {
          this.branch_organisation_list = response.data;
          this.branch_org_name = this.branch_organisation_list[0].bus_organisation_branch_id
        }
      }
    })
  }

  changeBranchOrg(row) { }
  changeOrg(row) { }
  private filterValue = "";

  applyFilter(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filterValue = (event.target as HTMLInputElement).value;
      this.filterValue = this.filterValue.trim(); // Remove whitespace
      this.dataSource.filter = this.filterValue;
      this.dataSource.data = this.ELEMENT_DATA;
    }
  }

  search() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_element') as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue;
    this.dataSource.data = this.ELEMENT_DATA;
  }

  refresh() {
    this.bus_geofence_list()
  }


  createGeofence() {
    this.routes.navigate(["web/bus_management/geofence/create_geofence"])
  }

  edit(model_data: BusGeofenceListResponseData) {
    this.routes.navigate([`web/bus_management/geofence/edit_geofence`, model_data.geofence_id]);
  }



  downloadPDF() {
    const title1 = 'UTrack Bus Gefonce Report\n';
    const title2 = 'Report generated on ' + DateUtils.getDisplayTodayDateTime()
    const pdf_heading_date = title1.concat(title2);
    let dashboardColumns: string[] = ['ID', 'Geofence Name', 'Latitude', 'Longitude', 'Location', 'Radius', 'Added Date & Time', 'Modified Date & Time', 'Status'];
    let data: String[][] = [];

    let i = 1;
    for (let value of this.ELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.geofence_name)
      row.push(value.latitude)
      row.push(value.longitude)
      row.push(value.location_name)
      row.push(value.radius)
      row.push(DateUtils.getDisplayDateTime(value.added_date))
      row.push(DateUtils.getDisplayDateTime(value.modified_date))
      row.push(value.status)
      data.push(row);
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_date, dashboardColumns, data, 'GeofenceList');
  }

  Exportexcle() {
    let columns = ['ID', 'Geofence Name', 'Latitude', 'Longitude', 'Location', 'Radius', 'Added Date & Time', 'Modified Date & Time', 'Status'];
    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Utrack');
    // Add Image
    const myLogoImage = workbook.addImage({
      base64: Base64ImageConstants.uTrackLogoWithBG,
      extension: 'png',
    });
    const ramkiLogo = workbook.addImage({
      base64: Base64ImageConstants.ramkiLogo,
      extension: 'png',
    });
    worksheet.mergeCells('A1:B3');
    worksheet.addImage(myLogoImage, 'A1:B3');

    worksheet.mergeCells('G1:G3');
    worksheet.addImage(ramkiLogo, 'G1:G3');
    //Add Row and formatting
    worksheet.mergeCells('C1', 'F2');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack Bus Geofence Report'
    titleRow.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells('C3', 'F3');
    let startToendData = worksheet.getCell('C3');
    startToendData.value = 'Report generated on' + ' ' + DateUtils.getDisplayTodayDateTime();
    startToendData.font = {
      name: 'Calibri',
      size: 14,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    startToendData.alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.addRow([]);
    //Adding Header Row
    let headerRow = worksheet.addRow(columns);
    headerRow.eachCell((cell, index) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' }
      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 14
      }

      cell.border = { top: { style: 'thin' }, left: { style: 'thin', }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    })
    // Adding Data with Conditional Formatting
    let i = 1;
    for (let value of this.ELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.geofence_name)
      row.push(value.latitude)
      row.push(value.longitude)
      row.push(value.location_name)
      row.push(value.radius)
      row.push(DateUtils.getDisplayDateTime(value.added_date))
      row.push(DateUtils.getDisplayDateTime(value.modified_date))
      row.push(value.status)
      worksheet.addRow(row)
      i++;
    }
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 35;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 35;
    worksheet.getColumn(6).width = 8;
    worksheet.getColumn(7).width = 25;
    worksheet.getColumn(8).width = 25;
    worksheet.getColumn(9).width = 12;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'GefonceList' + '.xlsx');
    })
  }
}
