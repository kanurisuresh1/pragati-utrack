import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Location } from '@angular/common';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { OpenDetailsComponent } from '../../dashboard/open-details/open-details.component';
import { MatDialog } from '@angular/material/dialog';
import { Home_V2_Data } from '../../../@theme/components/Model/Home_v2_Response';

@Component({
  selector: 'ngx-dashboard-report',
  templateUrl: './dashboard-report.component.html',
  styleUrls: ['./dashboard-report.component.scss']
})
export class DashboardReportComponent implements OnInit {

  TableDataNotshow: boolean;
  ELEMENT_DATA: Home_V2_Data[] = [];
  displayedColumns: string[] = ['id', 'vehicle_number', 'vehicle_type', 'speed', 'last_running_time','driver_name','driver_number','stopped_duration','last_location',];
  dataSource = new MatTableDataSource<Home_V2_Data>(this.ELEMENT_DATA);
  
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  to_date: string;

  constructor(private headerService: HeaderInteractorService,
    private location: Location,
    private dialog: MatDialog,
    private uTrackService: UtrackService,
    ) {
    
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Dashboard Report');
    this.dataSource.sort = this.sort;
    this.to_date = DateUtils.getDisplayTodayDateTime();
    this.dashboardReport();
  }

  dashboardReport() {
    this.uTrackService.home_v2().subscribe(response => {
      this.ELEMENT_DATA =[];
      if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
        this.TableDataNotshow = false;
        this.ELEMENT_DATA = response.data;
        this.ELEMENT_DATA.forEach(data => {
          switch (data.vehicle_type) {
            case 'Car': 

              switch (data.vehicle_motion_status) {
                case 0: data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_yellow_car.png';
                  break;

                case 1: data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_red_car.png';
                  break;

                case 2: data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_green_car.png';
                  break;
              }

              break;

            case 'Bus':
              switch (data.vehicle_motion_status) {
                case 0: data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_yellow_bus.png';
                  break;

                case 1: data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_red_bus.png';
                  break;

                case 2: data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_green_bus.png';
                  break;
              }

              break;

            case 'Truck': 
              switch (data.vehicle_motion_status) {
                case 0: data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_yellow_truck.png';
                  break;

                case 1: data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_red_truck.png';
                  break;

                case 2: data.vehicle_motion_status_image =
                  'assets/images/data_list_icons/marker_type_green_truck.png';
                  break;
              }

              break;

            case 'Auto': 

              switch (data.vehicle_motion_status) {
                case 0: data.vehicle_motion_status_image =
                  'assets/images/data_list_icons/marker_type_yellow_auto.png';
                  break;

                case 1: data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_red_auto.png';
                  break;

                case 2: data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_green_auto.png';
                  break;
              }

              break;

            case 'Bike':

              switch (data.vehicle_motion_status) {
                case 0: data.vehicle_motion_status_image =
                  'assets/images/data_list_icons/marker_type_yellow_bike.png';
                  break;

                case 1: data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_red_bike.png';
                  break;

                case 2: data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_green_bike.png';
                  break;
              }

              break;

            case 'Mobile':

              switch (data.vehicle_motion_status) {
                case 0: data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_yellow_mobile.png';
                  break;

                case 1: data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_red_mobile.png';
                  break;

                case 2: data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_green_mobile.png';
                  break;
              }

              break;

            case 'IDCard':

              switch (data.vehicle_motion_status) {
                case 0: data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_yellow_id.png';
                  break;

                case 1: data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_red_id.png';
                  break;

                case 2: data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_green_id.png';
                  break;
              }

              break;

            case 'Train':

              switch (data.vehicle_motion_status) {
                case 0: data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_train_yellow.png';
                  break;

                case 1: data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_train_red.png';
                  break;

                case 2: data.vehicle_motion_status_image =
                  'assets/images/data_list_icons/marker_type_train_green.png';
                  break;
              }

              break;

            case 'Scooty': 

              switch (data.vehicle_motion_status) {
                case 0: data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_yellow_scooty.png';
                  break;

                case 1: data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_red_scooty.png';
                  break;

                case 2: data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_green_scooty.png';
                  break;
              }

              break;
          }
        });
      } else {
        this.TableDataNotshow = true;
      }
      this.dataSource.data = this.ELEMENT_DATA;
    })
  }

  openDetails(model_data: Home_V2_Data) {
    const rowData = JSON.stringify(model_data);
    const dialogReference = this.dialog.open(OpenDetailsComponent, {
      disableClose: true,
      data: { vehicle_number: rowData },
    });
    dialogReference.afterClosed().subscribe(() => {
      dialogReference.close();
    });
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
    this.dashboardReport()
    this.to_date = DateUtils.getDisplayTodayDateTime();
  }

  downloadPDF() {
    const title1 = 'UTrack Trip Dashboard Report\n';
    const title2 = 'Report generated on ' + DateUtils.getDisplayTodayDateTime()
    const pdf_heading_date = title1.concat(title2);
    let dashboardColumns: string[] = ['ID', 'Vehicle Number', 'Vehicle Type', 'Speed (KMPH)', 'Last Date','Driver Name','Driver Number','Stopped Duration (HH:MM:SS)','last_location'];
    let data: String[][] = [];

    let i = 1;
    for (let value of this.ELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.vehicle_type);
      row.push(value.speed);
      row.push(value.dtime);
      row.push(value.driver_name);
      row.push(value.driver_mobile);
      row.push(value.lrt);
      row.push(value.landmark);
      data.push(row);
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_date, dashboardColumns, data, 'DashboardReport');
  }

  epxportexcle() {
    const columns = ['ID', 'Vehicle Number', 'Vehicle Type', 'Speed (KMPH)', 'Last Date','Driver Name','Driver Number','Stopped Duration (HH:MM:SS)','Nearest Location'];
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

    worksheet.mergeCells('I1:I3');
    worksheet.addImage(ramkiLogo, 'I1:I3');
    //Add Row and formatting
    worksheet.mergeCells('C1', 'F2');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack Trip Dashboard Report'
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
      row.push(value.vehicle_number);
      row.push(value.vehicle_type);
      row.push(value.speed);
      row.push(value.dtime);
      row.push(value.driver_name);
      row.push(value.driver_mobile);
      row.push(value.lrt);
      row.push(value.landmark);
      worksheet.addRow(row)
      i++;
    }
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 23;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 8;
    worksheet.getColumn(5).width = 23;
    worksheet.getColumn(6).width = 24;
    worksheet.getColumn(7).width = 18;
    worksheet.getColumn(8).width = 20;
    worksheet.getColumn(9).width = 80;
  
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'DashboardReport' + '.xlsx');
    })
  }
}
