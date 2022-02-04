import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TempAlertListResponseData } from '../../../@theme/components/Model/TempAlertListResponse';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { AddTemperatureAlertsComponent } from './add-temperature-alerts/add-temperature-alerts.component';
//excel import paclage
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { Location } from '@angular/common';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { AlertHistoryResponseData } from '../../../@theme/components/Model/AlertHistoryResponse';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'ngx-my-temperature-alerts',
  templateUrl: './my-temperature-alerts.component.html',
  styleUrls: ['./my-temperature-alerts.component.scss']
})
export class MyTemperatureAlertsComponent implements OnInit {

  TableDataNotshow: boolean;

  ELEMENT_DATA: TempAlertListResponseData[] = [];
  displayedColumns: string[] = ['id', 'vehicle_number', 'minimum_temperature', 'maxiMum_temperature', 'added_date', 'start_date_time', 'end_date_time', 'tripName', 'driverName', 'driverNumber', 'email', 'mobileNum', 'active',];
  dataSource = new MatTableDataSource<TempAlertListResponseData>(this.ELEMENT_DATA)

  constructor(private uTrackService: UtrackService,
    private dialog: MatDialog,
    private headerService: HeaderInteractorService,
    private location: Location,
    private router: Router,
  ) {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(event => this.modifyHeader(event));
  }
  selectedIndex = 0;
  modifyHeader(location: any) { // This method is called many times
    switch (location.url) {
      case '/web/temperature_dashboard/temperature_notifications':
        this.selectedIndex = 1;
        setTimeout(() => {
          this.mapTab({ index: 1 });
        }, 500);
        break;

      default:
        setTimeout(() => {
          this.mapTab({ index: 0 });
        }, 500);
        break;
    }
  }
  ngOnInit(): void {
    this.headerService.updateHeaderTitle('HEADER_NAMES.MyTemperature Alerts');
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.temp_alert_list();
  }
  page_index = 0;

  temp_alert_list() {
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    this.uTrackService.temp_alert_list(formData).subscribe(response => {
      this.ELEMENT_DATA = [];
      if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
        this.TableDataNotshow = false;
        response.data.forEach(data => {
          this.ELEMENT_DATA.push(data)
          if (data.status == "Expired") {
            data.status_type_button_color = "#ffe227"
          }
          if (data.status == "Inprogress" || data.status == "active" || data.status == "Active" || data.status == "Activate") {
            data.status_type_button_color = "#61b15a"
          }
          if (data.status == "In Active" || data.status == "InActive" || data.status == "Inactive" || data.status == "Inactivate") {
            data.status_type_button_color = "#ec4646"
          }
        })
      } else {
        this.TableDataNotshow = true;
      }
      this.dataSource.data = this.ELEMENT_DATA;
    })
  }

  ALERT_HOSTORY_DATA: AlertHistoryResponseData[] = [];
  alertDisplayCols: string[] = ['id', 'vehicle_number', 'alert_sub_type', 'message', 'added_date'];
  alertDataSource = new MatTableDataSource<AlertHistoryResponseData>(this.ALERT_HOSTORY_DATA)
  alertTableDataNotshow: boolean;
  alert_type: string = 'Temperature';

  alert_history() {
    this.page_index = 0;
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    formData.append('device_token', 'Web');
    formData.append('page_index', String(this.page_index));
    formData.append('alert_type', this.alert_type);
    this.uTrackService.alert_history(formData).subscribe(response => {
      this.ALERT_HOSTORY_DATA = [];
      if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
        this.alertTableDataNotshow = false;
        this.ALERT_HOSTORY_DATA = response.data;
        this.page_index++;
      } else {
        this.alertTableDataNotshow = true;
      }
      this.alertDataSource.data = this.ALERT_HOSTORY_DATA;
    })
  }

  private isLoadingApiData = false;
  private haveNextPageDataTab1 = true;

  @HostListener('mousewheel', ['$event'])
  handleScroll(event) {
    this.onTableScroll(event);
  }

  onTableScroll(e) {
    const tableViewHeight = e.target.offsetHeight
    const tableScrollHeight = e.target.scrollHeight
    const scrollLocation = e.target.scrollTop;
    const buffer = 100;
    const limit = tableScrollHeight - tableViewHeight - buffer;

    if (scrollLocation > limit) {
      if (!this.isLoadingApiData && this.haveNextPageDataTab1) {
        this.isLoadingApiData = true
        const formData = new FormData();
        formData.append('user_id', localStorage.getItem('USER_ID'));
        formData.append('device_token', 'Web');
        formData.append('page_index', String(this.page_index));
        formData.append('alert_type', this.alert_type);
        this.uTrackService.alert_history(formData).subscribe(response => {
          if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
            this.ALERT_HOSTORY_DATA = this.ALERT_HOSTORY_DATA.concat(response.data);
            this.isLoadingApiData = false;
            this.haveNextPageDataTab1 = true;
            this.page_index++;
          } else {
            this.isLoadingApiData = false;
            this.haveNextPageDataTab1 = false;
          }
          this.alertDataSource.data = this.ALERT_HOSTORY_DATA;
        })
      }
    }
  }

  mapTab($event) {
    if ($event.index == 1) {
      this.alert_history();
    }
  }

  private filterValue = "";
  private hist_filterValue = "";

  applyFilter(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filterValue = (event.target as HTMLInputElement).value;
      this.filterValue = this.filterValue.trim(); // Remove whitespace
      this.dataSource.filter = this.filterValue;
      this.temp_alert_list();
    }
  }

  hist_applyFilter(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.hist_filterValue = (event.target as HTMLInputElement).value;
      this.hist_filterValue = this.hist_filterValue.trim(); // Remove whitespace
      this.alertDataSource.filter = this.hist_filterValue;
      this.alertDataSource.data = this.ALERT_HOSTORY_DATA;
    }
  }

  search() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_element') as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue;
    this.temp_alert_list();
  }

  hist_search() {
    this.hist_filterValue = this.hist_filterValue.trim(); // Remove whitespace
    this.hist_filterValue = (document.getElementById('hist_alert_search_element') as HTMLInputElement).value;
    this.alertDataSource.filter = this.hist_filterValue;
    this.alertDataSource.data = this.ALERT_HOSTORY_DATA;
  }

  refresh() {
    this.temp_alert_list()
  }

  hist_refresh() {
    this.alert_history()
  }

  downloadPDF() {
    var converted_reportdate = DateUtils.getDisplayTodayDateTime();
    var myText = 'UTrack Temperature Alerts Details  \n  Report generated on '
    var pdf_heading_text = myText.concat(converted_reportdate)
    let customerTableColumn: string[] = ['ID', 'Vehicle Number', 'Min Temp', 'Max Temp', 'Added Date Time', 'From Date Time', 'To Date Time', 'Trip Name', 'Driver Name', 'Driver Number', 'Email', 'Mobile Number', 'Status'];
    let data: String[][] = [];
    let i = 1;
    for (let mydata of this.ELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(mydata.vehicle_number);
      row.push(mydata.min_temp);
      row.push(mydata.max_temp);
      row.push(DateUtils.getDisplayDateTime(mydata.added_date));
      row.push(DateUtils.getDisplayDateTime(mydata.start_date_time));
      row.push(DateUtils.getDisplayDateTime(mydata.end_date_time));
      row.push(mydata.trip_name);
      row.push(mydata.driver_name);
      row.push(mydata.driver_number);
      row.push(mydata.email);
      row.push(mydata.mobile_number);
      row.push(mydata.status);
      data.push(row);
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_text, customerTableColumn, data, 'TemperatureAlertsDetails');
  }

  epxportexcle() {
    let columns = ['ID', 'Vehicle Number', 'Vehicle Type', 'Min Temp', 'Max Temp', 'Added Date Time', 'From Date Time', 'To Date Time', 'Trip Name', 'Driver Name', 'Driver Number', 'Email', 'Mobile Number', 'Status'];
    const converted_reportdate = DateUtils.getDisplayTodayDateTime();
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
    worksheet.mergeCells('H1:H3');
    worksheet.addImage(ramkiLogo, 'H1:H3');
    //Add Row and formatting
    worksheet.mergeCells('C1', 'G2');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack Temperature Alerts Details '
    titleRow.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.mergeCells('C3', 'G3');
    let startToendData = worksheet.getCell('C3');
    startToendData.value = 'Report generated on' + ' ' + converted_reportdate
    startToendData.font = {
      name: 'Calibri',
      size: 18,
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
    for (let mydata of this.ELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(mydata.vehicle_number);
      row.push(mydata.min_temp);
      row.push(mydata.max_temp);
      row.push(DateUtils.getDisplayDateTime(mydata.added_date));
      row.push(DateUtils.getDisplayDateTime(mydata.start_date_time));
      row.push(DateUtils.getDisplayDateTime(mydata.end_date_time));
      row.push(mydata.trip_name);
      row.push(mydata.driver_name);
      row.push(mydata.driver_number);
      row.push(mydata.email);
      row.push(mydata.mobile_number);
      row.push(mydata.status);
      worksheet.addRow(row);
      i++;
    }
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 22;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 13;
    worksheet.getColumn(5).width = 13;
    worksheet.getColumn(6).width = 35;
    worksheet.getColumn(7).width = 23;
    worksheet.getColumn(8).width = 23;
    worksheet.getColumn(9).width = 23;
    worksheet.getColumn(10).width = 23;
    worksheet.getColumn(11).width = 23;
    worksheet.getColumn(12).width = 23;
    worksheet.getColumn(13).width = 23;
    worksheet.getColumn(14).width = 9;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'TemperatureAlertsDetails' + '.xlsx');
    })
  }

  hist_downloadPDF() {
    var converted_reportdate = DateUtils.getDisplayTodayDateTime();
    var myText = 'UTrack ' + this.alert_type + ' Alerts History Details  \n  Report generated on '
    var pdf_heading_text = myText.concat(converted_reportdate)
    let customerTableColumn: string[] = ['ID', 'Vehicle Number', 'Sub Type', 'Message', 'Date Time'];
    let data: String[][] = [];
    let i = 1;
    for (let mydata of this.ALERT_HOSTORY_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(mydata.vehicle_number);
      row.push(mydata.alert_sub_type);
      row.push(mydata.message);
      row.push(DateUtils.getDisplayDateTime(mydata.added_date));
      data.push(row);
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_text, customerTableColumn, data, this.alert_type + 'AlertsHistoryDetails');
  }

  hist_epxportexcle() {
    let columns = ['ID', 'Vehicle Number', 'Sub Type', 'Message', 'Date Time'];
    const converted_reportdate = DateUtils.getDisplayTodayDateTime();
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
    worksheet.mergeCells('H1:H3');
    worksheet.addImage(ramkiLogo, 'H1:H3');
    //Add Row and formatting
    worksheet.mergeCells('C1', 'G2');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack ' + this.alert_type + ' Alerts History Details '
    titleRow.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.mergeCells('C3', 'G3');
    let startToendData = worksheet.getCell('C3');
    startToendData.value = 'Report generated on' + ' ' + converted_reportdate
    startToendData.font = {
      name: 'Calibri',
      size: 18,
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
    for (let mydata of this.ALERT_HOSTORY_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(mydata.vehicle_number);
      row.push(mydata.alert_sub_type);
      row.push(mydata.message);
      row.push(DateUtils.getDisplayDateTime(mydata.added_date));
      worksheet.addRow(row);
      i++;
    }
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 13;
    worksheet.getColumn(3).width = 13;
    worksheet.getColumn(4).width = 35;
    worksheet.getColumn(5).width = 23;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, this.alert_type + 'AlertsHistoryDetails' + '.xlsx');
    })
  }

  add() {
    let dialogReference = this.dialog.open(AddTemperatureAlertsComponent, {
      disableClose: true
    })
    dialogReference.afterClosed().subscribe(result => {
      this.temp_alert_list();
    })
  }

  edit(model_data: TempAlertListResponseData) {
    let rowData = JSON.stringify(model_data)
    let dialogReference = this.dialog.open(AddTemperatureAlertsComponent, {
      disableClose: true,
      data: { device_link_id: rowData }
    })
    dialogReference.afterClosed().subscribe(result => {
      this.temp_alert_list();
    })
  }

  back() {
    this.location.back()
  }

}
