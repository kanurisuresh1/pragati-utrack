import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { environment } from '../../../../environments/environment';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe, Location } from '@angular/common';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpParams, HttpClient } from '@angular/common/http';
import { TripListResponse, TripListResponseData } from '../../../@theme/components/Model/TripListResponse';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
// drop down search 
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { HomeLiteData } from '../../../@theme/components/Model/HomeLite';
import { FormControl } from '@angular/forms';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { HomeLiteV1Data } from '../../../@theme/components/Model/HomeLiteV1Response';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-my-trips',
  templateUrl: './my-trips.component.html',
  styleUrls: ['./my-trips.component.scss']
})
export class MyTripsComponent implements OnInit {
  TableDataNotshow: boolean;
  TableCancelledDataNotshow: boolean;
  TableCompletedDataNotshow: boolean;
  TableInprogressDataNotshow: boolean;
  TableOverdueDataNotshow: boolean;
  TableUpcomingDataNotshow: boolean;
  NotShowVehicleData: boolean;
  ShowVehicleData:boolean;

  private vehicles: HomeLiteV1Data[] = []
  AllTripData: TripListResponseData[] = []
  upcoming: TripListResponseData[] = []
  overdueing: TripListResponseData[] = []
  ended: TripListResponseData[] = []
  cancelled: TripListResponseData[] = []
  inprogress: TripListResponseData[] = []
  todatDisplayedColumn: string[] = [
    'trip_id',
    'vehicle_number',
    'trip_name',
    'status',
    'start_date_time',
    'distance',
    'expences_Cost',
    'stops',
    'start_location',
    'Actions'
  ];
  AllTripListdataSource = new MatTableDataSource<TripListResponseData>(this.AllTripData)
  inprogressdataSource = new MatTableDataSource<TripListResponseData>(this.inprogress)
  upcomingdataSource = new MatTableDataSource<TripListResponseData>(this.upcoming)
  overdueingdataSource = new MatTableDataSource<TripListResponseData>(this.overdueing)
  endeddataSource = new MatTableDataSource<TripListResponseData>(this.ended)
  cancelleddataSource = new MatTableDataSource<TripListResponseData>(this.cancelled)
  deviceLinkId: any;
  device_link_id: any;
  overdueTripsCount = 0;

  @ViewChild('TableOneSort', { static: true }) AllTripListsort: MatSort;
  @ViewChild('TableTwoSort', { static: true }) OngoingTripListsort: MatSort;
  @ViewChild('TableThreeSort', { static: true }) UpcomingTripListsort: MatSort;
  @ViewChild('TableFourSort', { static: true }) OverdueTripListSort: MatSort;
  @ViewChild('TableFiveSort', { static: true }) completedTripListsort: MatSort;
  @ViewChild('TableSixSort', { static: true }) cancelledTripListsort: MatSort;
  selectall: string;


  constructor(private headerService: HeaderInteractorService, private http: HttpClient, private uTrackService: UtrackService, private location: Location, private routes: Router,
    private activatedRoute: ActivatedRoute,
    ) {
   
     }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.My Trips')
    // sort
    this.AllTripListdataSource.sort = this.AllTripListsort;
    this.inprogressdataSource.sort = this.OngoingTripListsort;
    this.upcomingdataSource.sort = this.UpcomingTripListsort;
    this.overdueingdataSource.sort = this.OverdueTripListSort;
    this.endeddataSource.sort = this.completedTripListsort;
    this.cancelleddataSource.sort = this.cancelledTripListsort;
    this.selectall = ''
    this.getVehicles();
    this.getTripList('');

    this.searchvehiclenumber.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterVehicles();
      });
  }

  createTrip() {
    this.routes.navigate([`../create-trip`],
      { relativeTo: this.activatedRoute })
  }

  tripDetails(trip_id) {
    this.routes.navigate([`../trip-details`, trip_id],
      { relativeTo: this.activatedRoute })
  }

  public filterValue = "";

  FillterAllTripList(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filterValue = (event.target as HTMLInputElement).value;
      this.filterValue = this.filterValue.trim(); // Remove whitespace
      this.AllTripListdataSource.filter = this.filterValue;
    }
  }

  searchAllTriplist() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_All_TripList') as HTMLInputElement).value;
    this.AllTripListdataSource.filter = this.filterValue;
  }

  FillterOngoingTripList(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filterValue = (event.target as HTMLInputElement).value;
      this.filterValue = this.filterValue.trim(); // Remove whitespace
      this.inprogressdataSource.filter = this.filterValue;
    }
  }

  searchOngoingTriplist() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_Ongoing_Triplist') as HTMLInputElement).value;
    this.inprogressdataSource.filter = this.filterValue;
  }

  FillterUpcomingTripList(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filterValue = (event.target as HTMLInputElement).value;
      this.filterValue = this.filterValue.trim(); // Remove whitespace
      this.upcomingdataSource.filter = this.filterValue;
    }
  }

  searchUpcomingTriplist() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_Upcominglist') as HTMLInputElement).value;
    this.upcomingdataSource.filter = this.filterValue;
  }

  FillterOverdueTripList(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filterValue = (event.target as HTMLInputElement).value;
      this.filterValue = this.filterValue.trim(); // Remove whitespace
      this.overdueingdataSource.filter = this.filterValue;
    }
  }

  searchOverdueTriplist() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_Overdue_TripList') as HTMLInputElement).value;
    this.overdueingdataSource.filter = this.filterValue;
  }

  FillterCompetedTripList(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filterValue = (event.target as HTMLInputElement).value;
      this.filterValue = this.filterValue.trim(); // Remove whitespace
      this.endeddataSource.filter = this.filterValue;
    }
  }


  searchCompetedTriplist() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_CompetedTripList') as HTMLInputElement).value;
    this.endeddataSource.filter = this.filterValue;
  }

  FillterCancelledTripList(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filterValue = (event.target as HTMLInputElement).value;
      this.filterValue = this.filterValue.trim(); // Remove whitespace
      this.cancelleddataSource.filter = this.filterValue;
    }
  }

  searchCancelledTriplist() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_CancelledTripList') as HTMLInputElement).value;
    this.cancelleddataSource.filter = this.filterValue;
  }

  refreshAllTripList() {
    this.getTripList('');
  }

  refreshOngoingTripListList() {
    this.getTripList('')
  }

  refreshUpcomingTripList() {
    this.getTripList('');
  }

  refresOverdueTripListList() {
    this.getTripList('');
  }

  refreshCompleteTripList() {
    this.getTripList('');
  }

  refrescanclledTripListList() {
    this.getTripList('');
  }

  back() {
    this.location.back()
  }

  AllTripListPdf() {
    var converted_reportdate = DateUtils.getDisplayTodayDateTime();
    var myText = 'UTrack All Trip List Details \n  Report generated on '
    var pdf_heading_text = myText.concat(converted_reportdate)
    let AllTableColumn: string[] = ['Id', 'Vehicle Number', 'Trip Name', 'Status', 'Create Date', 'Distance', 'Expences Cost', 'Stops', 'Start Location'];
    let data: String[][] = [];

    let i = 1;
    this.AllTripData.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.trip_name);
      row.push(value.status);
      row.push('01 oct 2020');
      row.push('355');
      row.push('1500');
      row.push('3')
      row.push(value.start_location);
      data.push(row);
      i++;
    }),
      PdfUtils.downloadPdf(pdf_heading_text, AllTableColumn, data, 'AllTripList');
  }

  AllTripListExportexcle() {
    let columns = ['Id', 'Vehicle Number', 'Trip Name', 'Status', 'Create Date', 'Distance', 'Expences Cost', 'Stops', 'Start Location'];
    const converted_reportdate = DateUtils.getDisplayTodayDateTime();
    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Utrack');
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
    worksheet.mergeCells('C1', 'H2');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack All Trip List Details'
    titleRow.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells('C3', 'H3');
    let startToendData = worksheet.getCell('C3');
    startToendData.value = 'Report generated on' + '  ' + converted_reportdate
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
    this.AllTripData.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.trip_name);
      row.push(value.status);
      row.push('01 oct 2020');
      row.push('355');
      row.push('1500');
      row.push('3')
      row.push(value.start_location);
      worksheet.addRow(row)
      i++;
    }),
      worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 21;
    worksheet.getColumn(3).width = 25;
    worksheet.getColumn(4).width = 12;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 13;
    worksheet.getColumn(7).width = 17;
    worksheet.getColumn(8).width = 8;
    worksheet.getColumn(9).width = 80;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'AllTripList' + '.xlsx');
    })
  }

  OngoingTripListPdf() {
    var converted_reportdate = DateUtils.getDisplayTodayDateTime();
    var myText = 'UTrack Ongoing Trip List Details \n  Report generated on '
    var pdf_heading_text = myText.concat(converted_reportdate)
    let OngoingTableColumn: string[] = ['Id', 'Vehicle Number', 'Trip Name', 'Status', 'Create Date', 'Distance', 'Expences Cost', 'Stops', 'Start Location'];
    let data: String[][] = [];

    let i = 1;
    this.inprogress.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.trip_name);
      row.push(value.status);
      row.push('01 oct 2020');
      row.push('355');
      row.push('1500');
      row.push('3')
      row.push(value.start_location);
      data.push(row);
      i++;
    }),
      PdfUtils.downloadPdf(pdf_heading_text, OngoingTableColumn, data, 'OngoingTripList');
  }

  OngoingTripListExportexcle() {
    let columns = ['Id', 'Vehicle Number', 'Trip Name', 'Status', 'Create Date', 'Distance', 'Expences Cost', 'Stops', 'Start Location'];
    const converted_reportdate = DateUtils.getDisplayTodayDateTime();
    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Utrack');
    //Add Image
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
    worksheet.mergeCells('C1', 'H2');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack Ongoing Trip List Details'
    titleRow.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells('C3', 'H3');
    let startToendData = worksheet.getCell('C3');
    startToendData.value = 'Report generated on' + '  ' + converted_reportdate
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
    this.inprogress.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.trip_name);
      row.push(value.status);
      row.push('01 oct 2020');
      row.push('355');
      row.push('1500');
      row.push('3')
      row.push(value.start_location);
      worksheet.addRow(row)
      i++;
    }),
      worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 21;
    worksheet.getColumn(3).width = 25;
    worksheet.getColumn(4).width = 12;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 13;
    worksheet.getColumn(7).width = 17;
    worksheet.getColumn(8).width = 8;
    worksheet.getColumn(9).width = 80;
    worksheet.addRow([]);
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'OngoingTripList' + '.xlsx');
    })
  }

  UpcoimgTripListPdf() {
    var converted_reportdate = DateUtils.getDisplayTodayDateTime();
    var myText = 'UTrack Upcoming Trip List Details \n  Report generated on '
    var pdf_heading_text = myText.concat(converted_reportdate)
    let UpcomingTableColumn: string[] = ['Id', 'Vehicle Number', 'Trip Name', 'Status', 'Create Date', 'Distance', 'Expences Cost', 'Stops', 'Start Location'];
    let data: String[][] = [];

    let i = 1;
    this.upcoming.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.trip_name);
      row.push(value.status);
      row.push('01 oct 2020');
      row.push('355');
      row.push('1500');
      row.push('3')
      row.push(value.start_location);
      data.push(row);
      i++;
    }),
      PdfUtils.downloadPdf(pdf_heading_text, UpcomingTableColumn, data, 'UpcomingTripList');
  }

  UpcomingTripListExportexcle() {
    let columns = ['Id', 'Vehicle Number', 'Trip Name', 'Status', 'Create Date', 'Distance', 'Expences Cost', 'Stops', 'Start Location'];
    const converted_reportdate = DateUtils.getDisplayTodayDateTime();
    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Utrack');
    //Add Image
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
    worksheet.mergeCells('C1', 'H2');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack Upcoming Trip List Details'
    titleRow.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.mergeCells('C3', 'H3');
    let startToendData = worksheet.getCell('C3');
    startToendData.value = 'Report generated on' + '  ' + converted_reportdate
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
    this.upcoming.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.trip_name);
      row.push(value.status);
      row.push('01 oct 2020');
      row.push('355');
      row.push('1500');
      row.push('3')
      row.push(value.start_location);
      worksheet.addRow(row)
      i++;
    }),
      worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 21;
    worksheet.getColumn(3).width = 25;
    worksheet.getColumn(4).width = 12;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 13;
    worksheet.getColumn(7).width = 17;
    worksheet.getColumn(8).width = 8;
    worksheet.getColumn(9).width = 80;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'UpcomingTripList' + '.xlsx');
    })
  }

  OverdueTripListPdf() {
    var converted_reportdate = DateUtils.getDisplayTodayDateTime();
    var myText = 'UTrack Overdue Trip List Details \n  Report generated on '
    var pdf_heading_text = myText.concat(converted_reportdate)
    let OverdueTableColumn: string[] = ['Id', 'Vehicle Number', 'Trip Name', 'Status', 'Create Date', 'Distance', 'Expences Cost', 'Stops', 'Start Location'];
    let data: String[][] = [];

    let i = 1;
    this.overdueing.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.trip_name);
      row.push(value.status);
      row.push('01 oct 2020');
      row.push('355');
      row.push('1500');
      row.push('3')
      row.push(value.start_location);
      data.push(row);
      i++;
    }),
      PdfUtils.downloadPdf(pdf_heading_text, OverdueTableColumn, data, 'OverdueTripList');
  }

  OverdueTripListExportexcle() {
    let columns = ['Id', 'Vehicle Number', 'Trip Name', 'Status', 'Create Date', 'Distance', 'Expences Cost', 'Stops', 'Start Location'];
    const converted_reportdate = DateUtils.getDisplayTodayDateTime();
    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Utrack');
    //Add Image
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
    worksheet.mergeCells('C1', 'H2');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack Overdue Trip List Details'
    titleRow.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.mergeCells('C3', 'H3');
    let startToendData = worksheet.getCell('C3');
    startToendData.value = 'Report generated on' + '  ' + converted_reportdate
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
    this.overdueing.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.trip_name);
      row.push(value.status);
      row.push('01 oct 2020');
      row.push('355');
      row.push('1500');
      row.push('3')
      row.push(value.start_location);
      worksheet.addRow(row)
      i++;
    }),
      worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 21;
    worksheet.getColumn(3).width = 25;
    worksheet.getColumn(4).width = 12;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 13;
    worksheet.getColumn(7).width = 17;
    worksheet.getColumn(8).width = 8;
    worksheet.getColumn(9).width = 80;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'OverdueTripList' + '.xlsx');
    })
  }

  CompetedTripListPdf() {
    var converted_reportdate = DateUtils.getDisplayTodayDateTime();
    var myText = 'UTrack Completed Trip List Details \n  Report generated on '
    var pdf_heading_text = myText.concat(converted_reportdate)
    let CompetedTableColumn: string[] = ['Id', 'Vehicle Number', 'Trip Name', 'Status', 'Create Date', 'Distance', 'Expences Cost', 'Stops', 'Start Location'];
    let data: String[][] = [];

    let i = 1;
    this.ended.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.trip_name);
      row.push(value.status);
      row.push('01 oct 2020');
      row.push('355');
      row.push('1500');
      row.push('3')
      row.push(value.start_location);
      data.push(row);
      i++;
    }),
      PdfUtils.downloadPdf(pdf_heading_text, CompetedTableColumn, data, 'CompetedTripList');
  }

  CompletedTripListExportexcle() {
    let columns = ['Id', 'Vehicle Number', 'Trip Name', 'Status', 'Create Date', 'Distance', 'Expences Cost', 'Stops', 'Start Location'];
    const converted_reportdate = DateUtils.getDisplayTodayDateTime();
    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Utrack');
    //Add Image
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
    worksheet.mergeCells('C1', 'H2');

    let titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack Completed Trip List Details'
    titleRow.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells('C3', 'H3');
    let startToendData = worksheet.getCell('C3');
    startToendData.value = 'Report generated on' + '  ' + converted_reportdate
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
    this.ended.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.trip_name);
      row.push(value.status);
      row.push('01 oct 2020');
      row.push('355');
      row.push('1500');
      row.push('3')
      row.push(value.start_location);
      worksheet.addRow(row)
      i++;
    }),
      worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 21;
    worksheet.getColumn(3).width = 25;
    worksheet.getColumn(4).width = 12;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 13;
    worksheet.getColumn(7).width = 17;
    worksheet.getColumn(8).width = 8;
    worksheet.getColumn(9).width = 80;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'CompletedTripList' + '.xlsx');
    })
  }

  CancelledTripListPdf() {
    var converted_reportdate = DateUtils.getDisplayTodayDateTime();
    var myText = 'UTrack Cancelled List Details \n  Report generated on '
    var pdf_heading_text = myText.concat(converted_reportdate)
    let CancelledTableColumn: string[] = ['Id', 'Vehicle Number', 'Trip Name', 'Status', 'Create Date', 'Distance', 'Expences Cost', 'Stops', 'Start Location'];
    let data: String[][] = [];

    let i = 1;
    this.cancelled.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.trip_name);
      row.push(value.status);
      row.push('01 oct 2020');
      row.push('355');
      row.push('1500');
      row.push('3')
      row.push(value.start_location);
      data.push(row);
      i++;
    }),
      PdfUtils.downloadPdf(pdf_heading_text, CancelledTableColumn, data, 'CancelledTripList');
  }

  CancelledTripListExportexcle() {
    let columns = ['Id', 'Vehicle Number', 'Trip Name', 'Status', 'Create Date', 'Distance', 'Expences Cost', 'Stops', 'Start Location'];
    const converted_reportdate = DateUtils.getDisplayTodayDateTime();
    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Utrack');
    //Add Image
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
    worksheet.mergeCells('C1', 'H2');

    let titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack Cancelled Trip List Details'
    titleRow.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells('C3', 'H3');
    let startToendData = worksheet.getCell('C3');
    startToendData.value = 'Report generated on' + '  ' + converted_reportdate
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
    this.cancelled.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.trip_name);
      row.push(value.status);
      row.push('01 oct 2020');
      row.push('355');
      row.push('1500');
      row.push('3')
      row.push(value.start_location);
      worksheet.addRow(row)
      i++;
    }),
      worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 21;
    worksheet.getColumn(3).width = 25;
    worksheet.getColumn(4).width = 12;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 13;
    worksheet.getColumn(7).width = 17;
    worksheet.getColumn(8).width = 8;
    worksheet.getColumn(9).width = 80;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'CancelledTripList' + '.xlsx');
    })
  }

  public searchvehiclenumber: FormControl = new FormControl();
  public filteredVehicleNumber: ReplaySubject<HomeLiteV1Data[]> = new ReplaySubject<HomeLiteV1Data[]>(1);

  @ViewChild('singleSelect', { static: false }) singleSelect: MatSelect;
  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();


  private filterVehicles() {
    if (!this.vehicles) {
      return;
    }
    // get the search keyword
    let search = this.searchvehiclenumber.value;
    if (!search) {
      this.filteredVehicleNumber.next(this.vehicles);
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the 
    this.filteredVehicleNumber.next(
      this.vehicles.filter(searchData => searchData.vehicle_number.toLowerCase().indexOf(search) > -1)
    );
  }


  getVehicles() {
    this.uTrackService.home_lite_v1().subscribe(response => {
      this.vehicles = response.data
      this.filteredVehicleNumber.next(this.vehicles);
    })
  }

  selectAllDropDownBtn() {
    this.getTripList('');
  }

  updateSelectedValue(getDeviceLinkId) {
    this.device_link_id = getDeviceLinkId
    this.getTripList(this.device_link_id)
  }

  getTripList(device_link_id) {
    const params = new HttpParams()
      .set('device_link_id', device_link_id)
      .set('user_id', localStorage.getItem("USER_ID"))
      .set('device_token', "Web")
      .set('X-Api-Key', environment.X_API_KEY)
    this.http.get<TripListResponse>(environment.apiBaseUrl + 'trip_list', { params }).subscribe(response => {

      this.AllTripData = []
      this.upcoming = []
      this.overdueing = []
      this.inprogress = []
      this.ended = []
      this.cancelled = []

      if(response.status){
        if (response.data != null && response.data != undefined && response.data.length > 0) {

          this.TableDataNotshow = false;
          this.NotShowVehicleData = false;
          this.ShowVehicleData = true;
  
          response.data.forEach((row) => {
            this.AllTripData.push(row)
            if (row.status == "Upcoming") {
              var g1 = new Date();
              var g2 = new Date(row.start_date_time);
              if (g1.getTime() < g2.getTime()) {
                this.upcoming.push(row)
              } else {
                this.overdueing.push(row);
              }
            }
  
            if (row.status == "Inprogress") {
              this.inprogress.push(row)
            }
  
            if (row.status == "Ended") {
              this.ended.push(row)
            }
  
            if (row.status == "Cancelled") {
              this.cancelled.push(row)
            }
          })
  
  
          this.cancelleddataSource.data = this.cancelled;
          this.inprogressdataSource.data = this.inprogress;
          this.endeddataSource.data = this.ended;
          this.upcomingdataSource.data = this.upcoming;
          this.AllTripListdataSource.data = this.AllTripData;
          this.overdueingdataSource.data = this.overdueing;
  
          if (this.cancelled.length > 0) {
            this.TableCancelledDataNotshow = false;
            this.TableDataNotshow = false;
          } else {
            this.TableCancelledDataNotshow = true;
            this.TableDataNotshow = false;
          }
  
          if (this.inprogress.length > 0) {
            this.TableInprogressDataNotshow = false;
            this.TableDataNotshow = false;
          } else {
            this.TableInprogressDataNotshow = true;
            this.TableDataNotshow = false;
          }
  
          if (this.ended.length > 0) {
            this.TableCompletedDataNotshow = false;
            this.TableDataNotshow = false;
          } else {
            this.TableCompletedDataNotshow = true;
            this.TableDataNotshow = false;
          }
  
          if (this.upcoming.length > 0) {
            this.TableUpcomingDataNotshow = false;
            this.TableDataNotshow = false;
          } else {
            this.TableUpcomingDataNotshow = true;
            this.TableDataNotshow = false;
          }
  
          if (this.AllTripData.length > 0) {
            this.TableDataNotshow = false;
  
          } else {
            this.TableDataNotshow = true;
  
          }
  
          if (this.overdueing.length > 0) {
            this.TableOverdueDataNotshow = false;
            this.TableDataNotshow = false;
          } else {
            this.TableOverdueDataNotshow = true;
            this.TableDataNotshow = false;
          }
  
        } else {
          this.TableDataNotshow = true;
          this.TableCancelledDataNotshow = false;
          this.TableInprogressDataNotshow = false;
          this.TableCompletedDataNotshow = false;
          this.TableUpcomingDataNotshow = false;
          this.TableOverdueDataNotshow = false;
          this.ShowVehicleData = false;
          this.NotShowVehicleData = true;
        }
      }else{
        this.TableDataNotshow = true;
        this.TableCancelledDataNotshow = false;
        this.TableInprogressDataNotshow = false;
        this.TableCompletedDataNotshow = false;
        this.TableUpcomingDataNotshow = false;
        this.TableOverdueDataNotshow = false;
        this.ShowVehicleData = false;
        this.NotShowVehicleData = true;
      }
    })
  }
}
