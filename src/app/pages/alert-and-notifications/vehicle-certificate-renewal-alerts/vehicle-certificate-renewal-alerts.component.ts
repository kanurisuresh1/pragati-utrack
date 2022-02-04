import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs';
import { FuelAlertListResponseData } from '../../../@theme/components/Model/FuelAlertListResponse';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AddFuelAlertComponent } from '../fuel-alerts/add-fuel-alert/add-fuel-alert.component';
import { VehicleCertificateRenewalListResponseData } from '../../../@theme/components/Model/VehicleCertificateRenewalListResponse';

@Component({
  selector: 'ngx-vehicle-certificate-renewal-alerts',
  templateUrl: './vehicle-certificate-renewal-alerts.component.html',
  styleUrls: ['./vehicle-certificate-renewal-alerts.component.scss']
})
export class VehicleCertificateRenewalAlertsComponent implements OnInit {

  TableDataNotshow: boolean;
  alertTableDataNotshow: boolean;

  ELEMENT_DATA: FuelAlertListResponseData[] = [];
  displayedColumns: string[] = ['id', 'vehicle_number', 'added_date', 'start_date_time', 'end_date_time', 'tripName', 'driverName', 'driverNumber', 'email', 'mobileNum', 'active',];
  dataSource = new MatTableDataSource<FuelAlertListResponseData>(this.ELEMENT_DATA)

  constructor(private uTrackService: UtrackService,
    private dialog: MatDialog,
    private headerService: HeaderInteractorService,
    private location: Location,
    private routes: Router,
    private activatedRoute: ActivatedRoute,
    ) { }
  alert_type: string = 'Certificate_Renewal'

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Vehicle Certificate Renewal Alert')
    this.alert_list();
  }

  back() {
    this.location.back();
  }

  RENEWAL_NOTIFICATIONS_LIST_DATA: VehicleCertificateRenewalListResponseData[] = [];
  alertDisplayCols: string[] = ['id', 'vehicle_number', 'certificate', 'expire_date', 'status'];
  alertDataSource = new MatTableDataSource<VehicleCertificateRenewalListResponseData>(this.RENEWAL_NOTIFICATIONS_LIST_DATA)

  mapTab($event) {
    if ($event.index == 1) {
      this.certificate_renewal_alert_list();
    }
  }

  certificate_renewal_alert_list() {
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    this.uTrackService.certificate_renewal_alert_list(formData).subscribe(response => {
      this.RENEWAL_NOTIFICATIONS_LIST_DATA = [];
      if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
        this.alertTableDataNotshow = false;
        this.RENEWAL_NOTIFICATIONS_LIST_DATA = response.data;
      } else {
        this.alertTableDataNotshow = true;
      }
      this.alertDataSource.data = this.RENEWAL_NOTIFICATIONS_LIST_DATA;
    })
  }

  alert_list() {
    this.alert_type = 'Certificate_Renewal';
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    formData.append('device_token', 'Web');
    formData.append('page_index', '0');
    formData.append('alert_type', this.alert_type);
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
  private hist_filterValue = "";

  applyFilter(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filterValue = (event.target as HTMLInputElement).value;
      this.filterValue = this.filterValue.trim(); // Remove whitespace
      this.dataSource.filter = this.filterValue;
      this.dataSource.data = this.ELEMENT_DATA;
    }
  }

  hist_applyFilter(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.hist_filterValue = (event.target as HTMLInputElement).value;
      this.hist_filterValue = this.hist_filterValue.trim(); // Remove whitespace
      this.alertDataSource.filter = this.hist_filterValue;
      this.alertDataSource.data = this.RENEWAL_NOTIFICATIONS_LIST_DATA;
    }
  }

  search() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_element') as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue;
    this.dataSource.data = this.ELEMENT_DATA;
  }

  hist_search() {
    this.hist_filterValue = this.hist_filterValue.trim(); // Remove whitespace
    this.hist_filterValue = (document.getElementById('hist_alert_search_element') as HTMLInputElement).value;
    this.alertDataSource.filter = this.hist_filterValue;
    this.alertDataSource.data = this.RENEWAL_NOTIFICATIONS_LIST_DATA;
  }

  refresh() {
    this.alert_list()
  }

  hist_refresh() {
    this.certificate_renewal_alert_list()
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
    let columns = ['id', 'Vehicle Number', 'Added Date Time', 'From Date Time', 'To Date Time', 'Trip Name', 'Driver Name', 'Driver Number', 'Email', 'Mobile Number', 'Status'];
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

  hist_downloadPDF() {
    var converted_reportdate = DateUtils.getDisplayTodayDateTime();
    var myText = 'UTrack ' + this.alert_type + ' Alerts Notification Details  \n  Report generated on '
    var pdf_heading_text = myText.concat(converted_reportdate)
    let customerTableColumn: string[] = ['ID', 'Vehicle Number', 'Certificate', 'Expire Date', 'Status'];
    let data: String[][] = [];

    let i = 1;
    for (let mydata of this.RENEWAL_NOTIFICATIONS_LIST_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(mydata.vehicle_number);
      row.push(mydata.certificate);
      row.push(DateUtils.getDisplayDateTime(mydata.expire_date));
      row.push(mydata.status);
      data.push(row);
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_text, customerTableColumn, data, this.alert_type);
  }

  hist_epxportexcle() {
    let columns = ['ID', 'Vehicle Number', 'Certificate', 'Expire Date', 'Status'];
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
    titleRow.value = 'UTrack ' + this.alert_type
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
    for (let mydata of this.RENEWAL_NOTIFICATIONS_LIST_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(mydata.vehicle_number);
      row.push(mydata.certificate);
      row.push(DateUtils.getDisplayDateTime(mydata.expire_date));
      row.push(mydata.status);
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
      fs.saveAs(blob, this.alert_type + '.xlsx');
    })
  }

  add() {
    localStorage.setItem("ALERT_TYPE", this.alert_type);
    let dialogReference = this.dialog.open(AddFuelAlertComponent, {
      disableClose: true
    })
    dialogReference.afterClosed().subscribe(result => {
      this.alert_list();
    })
  }

  edit(model_data: FuelAlertListResponseData) {
    let rowData = JSON.stringify(model_data)
    let dialogReference = this.dialog.open(AddFuelAlertComponent, {
      disableClose: true,
      data: { device_link_id: rowData }
    })
    dialogReference.afterClosed().subscribe(result => {
      this.alert_list();
    })
  }

  editVehicleNumber(device_link_id, vehicle_number) {
    this.routes.navigate([`../vehicle-details`, device_link_id, vehicle_number],
      { relativeTo: this.activatedRoute })
  }

}
