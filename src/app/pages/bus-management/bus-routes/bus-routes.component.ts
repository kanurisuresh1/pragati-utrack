import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BusRouteListResponseData } from '../../../@theme/components/Model/BusRouteListResponse';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { CreateBusRouteComponent } from './create-bus-route/create-bus-route.component';
import * as fs from 'file-saver';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { Workbook } from 'exceljs';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-bus-routes',
  templateUrl: './bus-routes.component.html',
  styleUrls: ['./bus-routes.component.scss']
})
export class BusRoutesComponent implements OnInit {

  constructor(private headerService: HeaderInteractorService,
    private dialog: MatDialog,
    private routes: Router,
    private uTrackService: UtrackService,) { }

  ngOnInit(): void {
    this.headerService.updateHeaderTitle('Routes');
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.bus_route_list();
  }
  ELEMENT_DATA: BusRouteListResponseData[] = [];
  displayedColumns: string[] = ['id', 'route_name', 'from_geofence_name', 'from_location_name', 'org_name', 'branch_name', 'added_date_time', 'stops_count', 'status', 'edit'];
  dataSource = new MatTableDataSource<BusRouteListResponseData>(this.ELEMENT_DATA)
  TableDataNotshow: boolean = false;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("content") content: ElementRef;

  bus_route_list() {
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));

    this.uTrackService.bus_route_list(formData).subscribe(response => {
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
    this.bus_route_list()
  }

  search() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_element') as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue;
    this.dataSource.data = this.ELEMENT_DATA;
  }


  busRoute() {
    let dialogReference = this.dialog.open(CreateBusRouteComponent, {
      width: '50%',
    })
    dialogReference.afterClosed().subscribe(result => {
      this.bus_route_list();
    })
  }

  edit(model_data: BusRouteListResponseData) {
    let rowData = JSON.stringify(model_data)
    let dialogReference = this.dialog.open(CreateBusRouteComponent, {
      width: '50%',
      data: { bus_route_id: rowData }
    })
    dialogReference.afterClosed().subscribe(result => {
      this.bus_route_list();
    })
  }

  route_details(element) {
    this.routes.navigate([`web/bus_management/bus_routes/bus_route_details`, element.bus_route_id]);

  }


  downloadPDF() {
    const title1 = 'UTrack Bus Report\n';
    const title2 = 'Report generated on ' + DateUtils.getDisplayTodayDateTime()
    const pdf_heading_date = title1.concat(title2);
    const dashboardColumns: string[] = ['ID', 'Route Name', 'From Geofence Name', 'To Geofence Name', 'Organisation Name', 'Branch Name', 'Added Date & Time', 'Stops Count', 'Status'];

    let data: String[][] = [];

    let i = 1;
    for (let value of this.ELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.route_name)
      row.push(value.from_geofence_name)
      row.push(value.to_location_name)
      row.push(value.org_name)
      row.push(value.branch_name)
      row.push(DateUtils.getDisplayDateTime(value.added_date_time))
      row.push(value.stops_count)
      row.push(value.status)
      data.push(row);
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_date, dashboardColumns, data, 'BusRouteReport');
  }

  Exportexcle() {
    const columns = ['ID', 'Route Name', 'From Geofence Name', 'To Geofence Name', 'Organisation Name', 'Branch Name', 'Added Date & Time', 'Stops Count', 'Status'];
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
    titleRow.value = 'UTrack Bus Route Report'
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
      row.push(value.route_name)
      row.push(value.from_geofence_name)
      row.push(value.to_location_name)
      row.push(value.org_name)
      row.push(value.branch_name)
      row.push(DateUtils.getDisplayDateTime(value.added_date_time))
      row.push(value.stops_count)
      row.push(value.status)
      worksheet.addRow(row)
      i++;
    }
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 25;
    worksheet.getColumn(5).width = 25;
    worksheet.getColumn(6).width = 25;
    worksheet.getColumn(7).width = 15;
    worksheet.getColumn(8).width = 15;
    worksheet.getColumn(9).width = 15;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'BusRouteReport' + '.xlsx');
    })
  }
}
