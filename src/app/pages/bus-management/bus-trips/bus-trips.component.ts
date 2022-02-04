import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs';
import { BusTripsListResponseData } from '../../../@theme/components/Model/BusTripsListResponse';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-bus-trips',
  templateUrl: './bus-trips.component.html',
  styleUrls: ['./bus-trips.component.scss']
})
export class BusTripsComponent implements OnInit {

  constructor(private headerService: HeaderInteractorService,
    private uTrackService: UtrackService) { }

  ngOnInit(): void {
    this.headerService.updateHeaderTitle('Trips');
    this.bus_trip_list();
  }

  ELEMENT_DATA: BusTripsListResponseData[] = [];
  displayedColumns: string[] = ['id', 'vehicle_number', 'org_name', 'branch_name', 'route_name', 'trip_type', 'trip_start_time', 'trip_end_time', 'edit'];
  dataSource = new MatTableDataSource<BusTripsListResponseData>(this.ELEMENT_DATA)
  TableDataNotshow: boolean = false;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("content") content: ElementRef;

  bus_trip_list() {
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    formData.append('bus_route_id', '1');
    formData.append('bus_organisation_branch_id', '2');
    formData.append('bus_organisation_id', '1');

    this.uTrackService.bus_trip_list(formData).subscribe(response => {
      if (response.status) {
        this.ELEMENT_DATA = [];
        if (response.data != null && response.data != undefined && response.data.length > 0) {
          this.ELEMENT_DATA = response.data;
          this.TableDataNotshow = false;
          this.dataSource.data = this.ELEMENT_DATA;
        } else {
          this.TableDataNotshow = true;
        }
      } else {
        this.TableDataNotshow = true;
      }
    })


  }

  private filterValue = "";

  applyFilter(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filterValue = (event.target as HTMLInputElement).value;
      this.filterValue = this.filterValue.trim(); // Remove whitespace
      this.dataSource.filter = this.filterValue;
      this.dataSource.data = this.ELEMENT_DATA;
    }
  }

  refresh() {
    this.bus_trip_list()
  }

  search() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_element') as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue;
    this.dataSource.data = this.ELEMENT_DATA;
  }

  add() {

  }

  edit(model_data) {

  }


  downloadPDF() {
    const title1 = 'UTrack Bus Trip Report\n';
    const title2 = 'Report generated on ' + DateUtils.getDisplayTodayDateTime()
    const pdf_heading_date = title1.concat(title2);
    const dashboardColumns: string[] = ['ID', 'Vehicle Number', 'Organisation Name', 'Branch Name', 'Route Name', 'Trip Type', 'Trip Start Time', 'Trip End Time'];

    let data: String[][] = [];

    let i = 1;
    for (let value of this.ELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number)
      row.push(value.org_name)
      row.push(value.branch_name)
      row.push(value.route_name)
      row.push(value.trip_type)
      row.push(value.trip_start_time)
      row.push(value.trip_end_time)
      data.push(row);
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_date, dashboardColumns, data, 'BusTripReport');
  }

  Exportexcle() {
    const columns = ['ID', 'Vehicle Number', 'Passenger Name', 'Username', 'Mobile', 'Email', 'Organisation Name', 'Branch Name', 'Route Name', 'Trip Type', 'Trip Start Time', 'Trip End Time'];
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
    titleRow.value = 'UTrack Bus Trip Report'
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
      row.push(value.vehicle_number)
      row.push(value.org_name)
      row.push(value.branch_name)
      row.push(value.route_name)
      row.push(value.trip_type)
      row.push(value.trip_start_time)
      row.push(value.trip_end_time)
      worksheet.addRow(row)
      i++;
    }
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 12;
    worksheet.getColumn(3).width = 25;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 25;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 28;
    worksheet.getColumn(8).width = 28;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'BusTripReport' + '.xlsx');
    })
  }
}
