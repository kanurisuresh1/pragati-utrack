import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationEnd, Router } from '@angular/router';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs';
import { filter } from 'rxjs/operators';
import { FuelAlertListResponseData } from '../../../@theme/components/Model/FuelAlertListResponse';
import { LessKmsReportNotificationResponseData } from '../../../@theme/components/Model/LessKMSReportNotificationRespones';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { AddFuelAlertComponent } from '../fuel-alerts/add-fuel-alert/add-fuel-alert.component';

@Component({
  selector: 'ngx-less-km-stop-data-not-receive',
  templateUrl: './less-km-stop-data-not-receive.component.html',
  styleUrls: ['./less-km-stop-data-not-receive.component.scss']
})
export class LessKmStopDataNotReceiveComponent implements OnInit {

  ShowLessKmsReportDataNotFound: boolean;
  TableDataNotshow: boolean;

  selectedIndex = 0

  private isLoadingApiData = false;
  alert_type: string;
  alert_type_name: string;

  constructor(
    private headerService: HeaderInteractorService,
    private uTrackService: UtrackService,
    private dialog: MatDialog,
    private loaction: Location,
    private router: Router) {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(event => this.modifyHeader(event));
  }

  modifyHeader(location: any) { // This method is called many times
    switch (location.url) {
      case '/web/alert_notifications/less_km_alerts':
        this.selectedIndex = 0;
        this.headerService.updateHeaderTitle('HEADER_NAMES.Less Kilometer Travel Alerts')
        setTimeout(() => {
          if (this.LessKmsReportList.length == 0) {
            this.alert_type = "LESS_KM_TRAVEL"
            this.alert_type_name = "HEADER_NAMES.Less KM"
          }
        }, 500);

        break;
      case '/web/alert_notifications/stopped_time_alerts':
        this.headerService.updateHeaderTitle('HEADER_NAMES.Stopeed More Then 3 Hrs. Alerts')
        this.selectedIndex = 0;
        setTimeout(() => {
          if (this.LessKmsReportList.length == 0) {
            this.alert_type = "STOPPED_MORE_THAN_3_HOURS";
            this.alert_type_name = "HEADER_NAMES.Stop"
          }
        }, 500);

        break;
      case '/web/alert_notifications/data_not_received_alerts':
        this.headerService.updateHeaderTitle('HEADER_NAMES.Data Not Received Alerts')
        this.selectedIndex = 0;
        setTimeout(() => {
          if (this.LessKmsReportList.length == 0) {
            this.alert_type = "DATA_NOT_RECEIVED"
            this.alert_type_name = "HEADER_NAMES.Data Not Received"
          }
        }, 500);
        break;
    }
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    setTimeout(() => {
      this.alert_list(this.alert_type);
    }, 500);
  }

  back() {
    this.loaction.back();
  }

  private page_index_tab2 = 0;
  private haveNextPageDataTab2 = true;

  mapTab($event) {
    if ($event.index == 1) {
      switch (this.alert_type) {
        case 'LESS_KM_TRAVEL':
          if (this.LessKmsReportList.length == 0) {
            this.getLessKmsReportList(this.alert_type);
          }
          break;
        case 'STOPPED_MORE_THAN_3_HOURS':
          if (this.LessKmsReportList.length == 0) {
            this.getLessKmsReportList(this.alert_type);
          }
          break;
        case 'DATA_NOT_RECEIVED':
          if (this.LessKmsReportList.length == 0) {
            this.getLessKmsReportList(this.alert_type);
          }
          break;
      }
    }
  }

  getLessKmsReportList(alert_type) {
    this.page_index_tab2 = 0
    this.uTrackService.getNotifocationLessKmsReportDetails(this.page_index_tab2, alert_type).subscribe(response => {
      if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
        this.ShowLessKmsReportDataNotFound = false;
        this.LessKmsReportList = response.data;
        this.LessKmsReportList.forEach((row) => {
          row.lessStartdate = DateUtils.getDisplayOnlyDate(row.start_date_time);
          row.lessStartTime = DateUtils.getDisplayTimeSec(row.start_date_time);
          row.lessEndTime = DateUtils.getDisplayTimeSec(row.end_date_time);
        })
        this.page_index_tab2++;
      } else {
        this.ShowLessKmsReportDataNotFound = true;
      }
    })
  }

  LessKmsReportList: LessKmsReportNotificationResponseData[] = []
  temparray = []

  lessKmsReportScorll(e) {
    const tableViewHeight = e.target.offsetHeight
    const tableScrollHeight = e.target.scrollHeight
    const scrollLocation = e.target.scrollTop;
    const buffer = 100;
    const limit = tableScrollHeight - tableViewHeight - buffer;
    if (scrollLocation > limit) {
      if (!this.isLoadingApiData && this.haveNextPageDataTab2) {
        this.isLoadingApiData = true
        this.uTrackService.getNotifocationLessKmsReportDetails(this.page_index_tab2.toString(), this.alert_type).subscribe(response => {
          if (response.status) {
            this.temparray = response.data;
            this.temparray.forEach((row) => {
              row.lessStartdate = DateUtils.getDisplayOnlyDate(row.start_date_time);
              row.lessStartTime = DateUtils.getDisplayTimeSec(row.start_date_time);
              row.lessEndTime = DateUtils.getDisplayTimeSec(row.end_date_time);
              this.LessKmsReportList.push(row)
            })
            this.isLoadingApiData = false;
            this.page_index_tab2++;
          } else {
            this.isLoadingApiData = false;
            this.haveNextPageDataTab2 = false;
          }
        })
      }
    }
  }

  ELEMENT_DATA: FuelAlertListResponseData[] = [];
  displayedColumns: string[] = ['id', 'vehicle_number', 'added_date', 'start_date_time', 'end_date_time', 'tripName', 'driverName', 'driverNumber', 'email', 'mobileNum', 'active',];
  dataSource = new MatTableDataSource<FuelAlertListResponseData>(this.ELEMENT_DATA)

  alert_list(alert_type: string) {
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    formData.append('device_token', 'Web');
    formData.append('page_index', '0');
    formData.append('alert_type', alert_type);

    this.uTrackService.alert_list(formData).subscribe(response => {
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
    this.alert_list(this.alert_type)
  }

  downloadPDF() {
    var converted_reportdate = DateUtils.getDisplayTodayDateTime();
    var myText = 'UTrack ' + this.alert_type + ' Alerts Details  \n  Report generated on '
    var pdf_heading_text = myText.concat(converted_reportdate)
    let customerTableColumn: string[] = ['ID', 'Vehicle Number', 'Added Date Time', 'From Date Time', 'To Date Time', 'Trip Name', 'Driver Name', 'Driver Number', 'Email', 'Mobile Number', 'Status'];
    let data: String[][] = [];

    let i = 1;
    for (let mydata of this.ELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(mydata.vehicle_number);
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
    PdfUtils.downloadPdf(pdf_heading_text, customerTableColumn, data, this.alert_type + 'AlertsDetails');
  }

  epxportexcle() {
    let columns = ['ID', 'Vehicle Number', 'Added Date Time', 'From Date Time', 'To Date Time', 'Trip Name', 'Driver Name', 'Driver Number', 'Email', 'Mobile Number', 'Status'];
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
    titleRow.value = 'UTrack ' + this.alert_type + ' Alerts Details '
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
    worksheet.getColumn(2).width = 13;
    worksheet.getColumn(3).width = 13;
    worksheet.getColumn(4).width = 35;
    worksheet.getColumn(5).width = 23;
    worksheet.getColumn(6).width = 23;
    worksheet.getColumn(7).width = 23;
    worksheet.getColumn(8).width = 23;
    worksheet.getColumn(9).width = 23;
    worksheet.getColumn(10).width = 23;
    worksheet.getColumn(11).width = 23;
    worksheet.getColumn(12).width = 9;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, this.alert_type + 'AlertsDetails' + '.xlsx');
    })
  }

  add() {
    localStorage.setItem("ALERT_TYPE", this.alert_type);
    let dialogReference = this.dialog.open(AddFuelAlertComponent, {
      disableClose: true
    })
    dialogReference.afterClosed().subscribe(result => {
      this.alert_list(this.alert_type);
    })
  }

  edit(model_data: FuelAlertListResponseData) {
    let rowData = JSON.stringify(model_data)
    let dialogReference = this.dialog.open(AddFuelAlertComponent, {
      disableClose: true,
      data: { device_link_id: rowData }
    })
    dialogReference.afterClosed().subscribe(result => {
      this.alert_list(this.alert_type);
    })
  }

}
