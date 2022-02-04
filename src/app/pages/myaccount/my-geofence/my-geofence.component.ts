import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { GeofenceListResponse, GeofenceListResponseData } from '../../../@theme/components/Model/GeofenceListResponse';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
//excel import paclage
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { GeofenceCustomAlertListDataEntity } from '../../../@theme/components/Model/GeofenceCustomAlertListResponse';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateGeofenceAlertComponent } from './create-geofence-alert/create-geofence-alert.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NbToastrService } from '@nebular/theme';
import { filter } from 'rxjs/operators';
import { AlertHistoryResponseData } from '../../../@theme/components/Model/AlertHistoryResponse';
import Swal from 'sweetalert2';

@Component({
  selector: 'ngx-my-geofence',
  templateUrl: './my-geofence.component.html',
  styleUrls: ['./my-geofence.component.scss']
})
export class MyGeofenceComponent implements OnInit {

  TableDataNotshow: boolean = false;
  alertTableDataNotshow: boolean = false;
  geofence_custom_alert_id: string;
  selectedIndex = 0;
  device_geofence_trans_id: string;

  MyGeofenceData: GeofenceListResponseData[] = []
  displayedColumn: string[] = [
    'id',
    'geofence_name',
    'location_name',
    'radius',
    'latitude',
    'longitude',
    'Actions'
  ];
  MyGeofenceListdataSource = new MatTableDataSource<GeofenceListResponseData>(this.MyGeofenceData)

  AlertGeofenceCustomeData: GeofenceCustomAlertListDataEntity[] = []
  AlertGeofenceCustomeDisplayedColumn: string[] = [
    'id',
    'geofence_name',
    'vehicle_numbers',
    'from_date_time',
    'to_date_time',
    'mobile_numbers',
    'email_ids',
    'status',
    'Actions'
  ];
  AlertGeofenceCustomeListdataSource = new MatTableDataSource<GeofenceCustomAlertListDataEntity>(this.AlertGeofenceCustomeData)

  @ViewChild('TableOneSort', { static: true }) MyGeofenceListsort: MatSort;
  @ViewChild('TableOneSort', { static: true }) AlertGeofenceCustomListsort: MatSort;

  constructor(
    private headerService: HeaderInteractorService,
    private location: Location,
    private http: HttpClient,
    private routes: Router,
    private activatedRoute: ActivatedRoute,
    private uTrackService: UtrackService,
    private dialog: MatDialog,
    private modalService: NgbModal,
    private toasterService: NbToastrService,
  ) {
    this.routes.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(event => this.modifyHeader(event));
  }

  modifyHeader(location: any) { // This method is called many times
    if (location.url === '/web/alert_notifications/geofence_alerts') {
      this.selectedIndex = 1;
    } else {
      this.selectedIndex = 0;
    }
  }
  ngOnInit(): void {
    this.headerService.updateHeaderTitle('HEADER_NAMES.My Geofence')
    this.MyGeofenceListdataSource.sort = this.MyGeofenceListsort;
    this.AlertGeofenceCustomeListdataSource.sort = this.AlertGeofenceCustomListsort;
    this.getGeofenceList();
    this.getAlertGeofenceCustomeList();
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
  }

  back() {
    this.location.back();
  }

  mapTab($event) {
    if ($event.index == 2) {
      this.alert_history();
    }
  }
  page_index = 0;
  ALERT_HOSTORY_DATA: AlertHistoryResponseData[] = [];
  alertDisplayCols: string[] = ['id', 'vehicle_number', 'alert_sub_type', 'message', 'added_date'];
  alertDataSource = new MatTableDataSource<AlertHistoryResponseData>(this.ALERT_HOSTORY_DATA)
  alert_type: string = 'Geofence'
  alertHistoryTableDataNotshow: boolean;

  alert_history() {
    this.alert_type = 'Geofence';
    this.page_index = 0;
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    formData.append('device_token', 'Web');
    formData.append('page_index', String(this.page_index));
    formData.append('alert_type', this.alert_type);

    this.uTrackService.alert_history(formData).subscribe(response => {
      this.ALERT_HOSTORY_DATA = [];
      if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
        this.alertHistoryTableDataNotshow = false;
        this.ALERT_HOSTORY_DATA = response.data;
        this.page_index++;
      } else {
        this.alertHistoryTableDataNotshow = true;
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
            this.alertDataSource.data = this.ALERT_HOSTORY_DATA;
            this.isLoadingApiData = false;
            this.haveNextPageDataTab1 = true;
            this.page_index++;
          } else {
            this.isLoadingApiData = false;
            this.haveNextPageDataTab1 = false;
          }
        })
      }
    }
  }

  private hist_filterValue = "";

  hist_applyFilter(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.hist_filterValue = (event.target as HTMLInputElement).value;
      this.hist_filterValue = this.hist_filterValue.trim(); // Remove whitespace
      this.alertDataSource.filter = this.hist_filterValue;
      this.alertDataSource.data = this.ALERT_HOSTORY_DATA;
    }
  }

  hist_search() {
    this.hist_filterValue = this.hist_filterValue.trim(); // Remove whitespace
    this.hist_filterValue = (document.getElementById('hist_alert_search_element') as HTMLInputElement).value;
    this.alertDataSource.filter = this.hist_filterValue;
    this.alertDataSource.data = this.ALERT_HOSTORY_DATA;
  }

  hist_refresh() {
    this.alert_history()
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

  private filterValue = "";

  applyFilter(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filterValue = (event.target as HTMLInputElement).value;
      this.filterValue = this.filterValue.trim(); // Remove whitespace
      this.MyGeofenceListdataSource.filter = this.filterValue;
      this.getGeofenceList();
    }
  }

  search() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('searchMyrouteName') as HTMLInputElement).value;
    this.MyGeofenceListdataSource.filter = this.filterValue;
    this.getGeofenceList();
  }

  refresh() {
    this.getGeofenceList()
  }

  downloadPDF() {
    var converted_reportdate = DateUtils.getDisplayTodayDateTime();
    var myText = 'UTrack My Geofence Details  \n  Report generated on '
    var pdf_heading_text = myText.concat(converted_reportdate)
    let MyGeofenceListTableColumn: string[] = ['Id', 'Geofence Name', 'Nearest Location', 'Radius (Meters)', 'Latitude', 'Latitude'];
    let data: String[][] = [];
    let i = 1;
    this.MyGeofenceData.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.geofence_name)
      row.push(value.location_name)
      row.push(value.radius)
      row.push(value.latitude)
      row.push(value.longitude)
      data.push(row);
      i++;
    }),
      PdfUtils.downloadPdf(pdf_heading_text, MyGeofenceListTableColumn, data, 'MyGeofenceListDetails');
  }

  exportexcle() {
    let columns = ['Id', 'Geofence Name', 'Nearest Location', 'Radius (Meters)', 'Latitude', 'Latitude'];
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
    worksheet.mergeCells('E1:F3');
    worksheet.addImage(ramkiLogo, 'E1:F3');
    //Add Row and formatting
    worksheet.mergeCells('C1', 'D2');

    let titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack My Geofence Details'
    titleRow.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells('C3', 'D3');
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
    this.MyGeofenceData.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.geofence_name)
      row.push(value.location_name)
      row.push(value.radius)
      row.push(value.latitude)
      row.push(value.longitude)
      worksheet.addRow(row)
      i++;
    }),
      worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 22;
    worksheet.getColumn(3).width = 80;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 13;
    worksheet.getColumn(6).width = 13;
    worksheet.addRow([]);
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'MyGeofenceListDetails' + '.xlsx');
    })
  }

  getGeofenceList() {
    const params = new HttpParams()
      .set('user_id', localStorage.getItem("USER_ID"))
      .set('device_token', "Web")
      .set('X-Api-Key', environment.X_API_KEY)
    this.http.get<GeofenceListResponse>(environment.apiBaseUrl + 'geofence_list', { params }).subscribe(response => {
      this.MyGeofenceData = []

      if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
        this.TableDataNotshow = false;
        response.data.forEach((row) => {
          this.MyGeofenceData.push(row)
          row.latitude = (parseFloat(row.latitude).toFixed(5));
          row.longitude = (parseFloat(row.longitude).toFixed(5));
        })
      } else {
        this.TableDataNotshow = true;
      }
      this.MyGeofenceListdataSource.data = this.MyGeofenceData;
    })
  }

  createGeofence() {
    this.routes.navigate([`../create-geofence`],
      { relativeTo: this.activatedRoute })
  }

  editGeofence(geofence_id, latitude, longitude, radius, location_name, geofence_name) {
    this.routes.navigate([`../edit-geofence`, geofence_id, latitude, longitude, radius, location_name, geofence_name],
      { relativeTo: this.activatedRoute })
  }

  GeofenceDetails(latitude, longitude, radius, location_name, geofence_name) {
    this.routes.navigate([`../geofence-details`, latitude, longitude, radius, location_name, geofence_name],
      { relativeTo: this.activatedRoute })
  }

  // custom aletr Geofence List

  private GeofenceAletrfilterValue = '';

  applyGeofenceAletrFilter(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.GeofenceAletrfilterValue = (event.target as HTMLInputElement).value;
      this.GeofenceAletrfilterValue = this.GeofenceAletrfilterValue.trim(); // Remove whitespace
      this.AlertGeofenceCustomeListdataSource.filter = this.GeofenceAletrfilterValue;
      this.getAlertGeofenceCustomeList();
    }
  }

  geofenceAletrsearch() {
    this.GeofenceAletrfilterValue = this.GeofenceAletrfilterValue.trim(); // Remove whitespace
    this.GeofenceAletrfilterValue = (document.getElementById('searchGeofenceAlert') as HTMLInputElement).value;
    this.AlertGeofenceCustomeListdataSource.filter = this.GeofenceAletrfilterValue;
    this.getAlertGeofenceCustomeList();
  }

  geofencealetrRefresh() {
    this.getAlertGeofenceCustomeList();
  }

  geofenceAletrDownloadPDF() {
    var converted_reportdate = DateUtils.getDisplayTodayDateTime();
    var myText = 'UTrack Geofence Alertes List \n  Report generated on '
    var pdf_heading_text = myText.concat(converted_reportdate)
    let GeofenceAlertListTableColumn: string[] = [
      'ID',
      'Geofence Name',
      'Vehicle Numbers',
      'From Date Time',
      'To Dat Time',
      'Mobile Numbers',
      'Email Ids',
      'Status',
    ];
    let data: String[][] = [];
    let i = 1;
    this.AlertGeofenceCustomeData.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.geofence_name)
      row.push(value.vehicle_numbers)
      row.push(value.from_date_time)
      row.push(value.to_date_time)
      row.push(value.mobile_numbers)
      row.push(value.email_ids)
      row.push(value.status)
      data.push(row);
      i++;
    }),
      PdfUtils.downloadPdf(pdf_heading_text, GeofenceAlertListTableColumn, data, 'GeofenceCustomAletrList');
  }


  geofenceAletrexportexcle() {
    let columns =
      [
        'ID',
        'Geofence Name',
        'Vehicle Numbers',
        'From Date Time',
        'To Dat Time',
        'Mobile Numbers',
        'Email Ids',
        'Status',
      ];
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
    worksheet.mergeCells('G1:H3');
    worksheet.addImage(ramkiLogo, 'G1:H3');
    //Add Row and formatting
    worksheet.mergeCells('C1', 'E2');

    let titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack Geofence Alertes List'
    titleRow.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells('C3', 'E3');
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
    this.AlertGeofenceCustomeData.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.geofence_name)
      row.push(value.vehicle_numbers)
      row.push(value.from_date_time)
      row.push(value.to_date_time)
      row.push(value.mobile_numbers)
      row.push(value.email_ids)
      row.push(value.status)
      worksheet.addRow(row)
      i++;
    }),
      worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 22;
    worksheet.getColumn(3).width = 40;
    worksheet.getColumn(4).width = 22;
    worksheet.getColumn(5).width = 19;
    worksheet.getColumn(6).width = 40;
    worksheet.getColumn(7).width = 50;
    worksheet.getColumn(8).width = 8;
    worksheet.addRow([]);
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'GeofenceCustomAletrList' + '.xlsx');
    })
  }

  getAlertGeofenceCustomeList() {
    this.uTrackService.geofence_custom_alert_list().subscribe(response => {
      this.AlertGeofenceCustomeData = [];
      if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
        this.alertTableDataNotshow = false;
        this.AlertGeofenceCustomeData = response.data;
        this.AlertGeofenceCustomeData.forEach(data => {
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
        this.alertTableDataNotshow = true;
      }
      this.AlertGeofenceCustomeListdataSource.data = this.AlertGeofenceCustomeData;
    })
  }

  addGeofenceAlert() {
    let dialogReference = this.dialog.open(CreateGeofenceAlertComponent, {
      disableClose: true
    })
    dialogReference.afterClosed().subscribe(result => {
      this.getAlertGeofenceCustomeList();
    })
  }

  edit(model_data: GeofenceCustomAlertListDataEntity) {
    let rowData = JSON.stringify(model_data)
    let dialogReference = this.dialog.open(CreateGeofenceAlertComponent, {
      disableClose: true,
      data: { geofence_custom_alert_id: rowData }
    })
    dialogReference.afterClosed().subscribe(result => {
      this.getAlertGeofenceCustomeList();
    })
  }

  deleteModel(GeofenceCustomAlertId) {
    this.geofence_custom_alert_id = GeofenceCustomAlertId;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ce1212',
      cancelButtonColor: '#81b214',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.delete();
      } else {
        result.dismiss === Swal.DismissReason.cancel
      }
    })
  }

  delete() {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    }
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    formData.append('geofence_custom_alert_id', this.geofence_custom_alert_id);
    this.uTrackService.geofence_custom_alert_delete(formData).subscribe(response => {
      this.toasterService.success('', response.message)
      this.modalService.dismissAll('Closed');
      this.getAlertGeofenceCustomeList();
    })
  }


  deleteGeofenceModel(device_geofence_trans_id) {
    this.device_geofence_trans_id = device_geofence_trans_id;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ce1212',
      cancelButtonColor: '#81b214',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.deleteGeofence();
      } else {
        result.dismiss === Swal.DismissReason.cancel
      }
    })
  }

  deleteGeofence() {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    }
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    formData.append('user_type', localStorage.getItem('USER_TYPE'));
    formData.append('device_token', "Web");
    formData.append('device_geofence_trans_id', this.device_geofence_trans_id);
    this.uTrackService.geofence_delete(formData).subscribe(response => {
      this.toasterService.success('', response.message);
      this.getGeofenceList();
    })
  }

}
