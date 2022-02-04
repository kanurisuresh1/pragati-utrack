import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
import { AllDeviceReportStatsCustom, DetailEntity } from '../../../@theme/components/Model/AllDeviceReportStatsCustomResponse';
//excel import paclage
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ShowVehicleDetailsComponent } from './show-vehicle-details/show-vehicle-details.component';
import { ShowCustomDateComponent } from './show-custom-date/show-custom-date.component';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { AllDeviceReport } from '../../../@theme/components/Model/NewAllDeviceV1ReportStatsResponse';
import { NbToastrService } from '@nebular/theme';
import { TodayVehicleGraphViewComponent } from './today-vehicle-graph-view/today-vehicle-graph-view.component';
import { SelectDateVehicleGraphViewComponent } from './select-date-vehicle-graph-view/select-date-vehicle-graph-view.component';
import { CumulativeGraphViewComponent } from './cumulative-graph-view/cumulative-graph-view.component';
import { DetailGraphViewComponent } from './detail-graph-view/detail-graph-view.component';
import { SelectMonthGraphViewComponent } from './select-month-graph-view/select-month-graph-view.component';

export const MY_FORMATS = {
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};

@Component({
  selector: 'ngx-kilometer-summerymanagement',
  templateUrl: './kilometer-summerymanagement.component.html',
  styleUrls: ['./kilometer-summerymanagement.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },

  ],
})

export class KilometerSummerymanagementComponent implements OnInit {

  public date: FormControl = new FormControl(moment());
  public todayDate = new Date();
  public yesterDay = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
  public weekDay = new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000));

  cumulative: boolean = true;
  detailed: boolean;
  public selectedVal: string;

  TodayTableDataNotshow:boolean;
  SelectDateTableDataNotshow:boolean;
  cumulativeTableDataNotshow:boolean;
  CustomeDetailsTableDataNotshow:boolean;
  MonthDatelisTableDataNotshow:boolean;

  TodayELEMENT_DATA: AllDeviceReport[] = []
  todatDisplayedColumn: string[] = [
    'device_id',
    'vehicle_number',
    'vehicle_type',
    'today_kms',
    'today_travel_time',
    'this_week_kms',
    'this_week_travel_time',
    'this_month_kms',
    'this_month_travel_time',
  ];
  todaydataSource = new MatTableDataSource<AllDeviceReport>(this.TodayELEMENT_DATA)

  SelectELEMENT_DATA: AllDeviceReport[] = []
  SelectDisplayedColumn: string[] = [
    'vehicle_id',
    'vehicle_number',
    'vehicle_type',
    'total_distance',
    'total_travelled_time',
    'max_speed',
    'avg_speed'
  ];
  SelectDatedataSource = new MatTableDataSource<AllDeviceReport>(this.SelectELEMENT_DATA)

  CustomeDate_cumulative_data: AllDeviceReportStatsCustom[] = []
  CustomeDate_cumulative_data_DisplayedColumn: string[] = [
    'vehicle_id',
    'vehicle_number',
    'vehicle_type',
    'total_distance',
    'total_travelled_time',
    'max_speed',
    'avg_speed',
  ];
  CustomeDate_cumulative_dataSource = new MatTableDataSource<AllDeviceReportStatsCustom>(this.CustomeDate_cumulative_data)


  CustomeDate_Detail_View: DetailEntity[] = []
  CustomeDate_detaileD_DisplayedColumn: string[] = [
    'vehicle_id',
    'vehicle_number',
    'vehicle_type',
    'date',
    'total_distance',
    'total_travelled_time',
    'max_speed',
    'avg_speed',
    'Cummulative_distance'
  ];
  Custome_Detail_View_data_Source = new MatTableDataSource<DetailEntity>(this.CustomeDate_Detail_View)

  MonthDetailsELEMENT_DATA: AllDeviceReport[] = []
  MonthDetailsDisplayedColumn: string[] = [
    'vehicle_id',
    'vehicle_number',
    'vehicle_type',
    'total_distance',
    'total_travelled_time',
    'max_speed',
    'avg_speed',
  ];
  MonthDetailsdataSource = new MatTableDataSource<AllDeviceReport>(this.MonthDetailsELEMENT_DATA)

  @ViewChild('TableOneSort', { static: true }) Todaysort: MatSort;
  @ViewChild('TableTwoSort', { static: true }) selectDatesort: MatSort;
  @ViewChild('TableThreeSort', { static: true }) customeDateCumulative: MatSort;
  @ViewChild('TableThreeSort1', { static: true }) customeDateDetalied: MatSort;
  @ViewChild('TableFourSort', { static: true }) monthDetailes: MatSort;

  constructor(
    private headreService: HeaderInteractorService,
    private location: Location,
    private uTrackService: UtrackService,
    private routes: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private toasterService: NbToastrService,
  ) { }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headreService.updateHeaderTitle('HEADER_NAMES.Kilometer Summary Management')
    this.todaydataSource.sort = this.Todaysort;
    this.SelectDatedataSource.sort = this.selectDatesort;
    this.CustomeDate_cumulative_dataSource.sort = this.customeDateCumulative;
    this.Custome_Detail_View_data_Source.sort = this.customeDateDetalied;
    this.MonthDetailsdataSource.sort = this.monthDetailes;
    this.getTodayList();
    this.getCustomDatesData();
    this.selectedVal = 'option1';
  }

  public onValChange(val: string) {
    this.selectedVal = val;
  }

  trackHistory(device_link_id) {
    this.routes.navigate([`web/track_history`, device_link_id])
    { relativeTo: this.activatedRoute }
  }
  public filterValue = "";

  todayFillterList(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filterValue = (event.target as HTMLInputElement).value;
      this.filterValue = this.filterValue.trim(); // Remove whitespace
      this.todaydataSource.filter = this.filterValue;
      this.getTodayList();
    }
  }

  selectDateFillterList(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filterValue = (event.target as HTMLInputElement).value;
      this.filterValue = this.filterValue.trim(); // Remove whitespace
      this.SelectDatedataSource.filter = this.filterValue;
      this.getSelectDate();
    }
  }


  monthListFillterList(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filterValue = (event.target as HTMLInputElement).value;
      this.filterValue = this.filterValue.trim(); // Remove whitespace
      this.MonthDetailsdataSource.filter = this.filterValue;
      this.getMonthList();
    }
  }

  search_todaylist() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_element_today') as HTMLInputElement).value;
    this.todaydataSource.filter = this.filterValue;
    this.getTodayList();
  }

  search_selectDate() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_element_selectDate') as HTMLInputElement).value;
    this.SelectDatedataSource.filter = this.filterValue;
    this.getSelectDate();
  }

  search_monthList() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_element_month') as HTMLInputElement).value;
    this.MonthDetailsdataSource.filter = this.filterValue;
    this.getMonthList();
  }

  refreshTodayList() {
    this.getTodayList()
  }

  refreshSelectDateList() {
    this.getSelectDate()
  }

  customDatesRefresh() {
    this.getCustomDatesData()
  }

  refreshMonthList() {
    this.getMonthList()
  }

  back() {
    this.location.back()
  }

  SelectDateKilometerMmanagement = new FormGroup({
    selectDate: new FormControl(this.yesterDay, [Validators.required]),
  })

  CustomDatesDataKilometerMmanagement = new FormGroup({
    StartDate: new FormControl(this.weekDay, [Validators.required]),
    EndDate: new FormControl(this.todayDate, [Validators.required]),
  })

  chosenYearHandler(normalizedYear: moment.Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: moment.Moment, datepicker: MatDatepicker<moment.Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    this.monthDate = this.date.value._d
    this.getMonthList();
    datepicker.close();
  }

  public currentDate = new Date();

  downloadTodayKMPdf() {
    const title1 = 'UTrack Kilometer Summary Report' + DateUtils.getDisplayTodayDate() + '\n';
    const title2 = 'Report generated on ' + DateUtils.getDisplayTodayDateTime();
    const pdf_heading_date = title1.concat(title2);
    let Todaycolumns: string[] = ['ID', 'Vehicle Number', 'Vehicle Type', 'Today Distance (KM)', 'Today Travel Time (HH:MM:SS)', 'This Week Distance (KM)', 'This Week Travel Time (HH:MM:SS)', 'This Month Distance (KM) ', 'This Month Travel Time (HH:MM:SS)'];
    let data: String[][] = [];

    let i = 1;
    this.TodayELEMENT_DATA.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.vehicle_type);
      row.push(value.today.total_distance);
      row.push(value.today.total_travelled_time);
      row.push(value.this_week.total_distance);
      row.push(value.this_week.total_travelled_time);
      row.push(value.this_month.total_distance);
      row.push(value.this_month.total_travelled_time);
      data.push(row);
      i++;
    }),
      PdfUtils.downloadPdf(pdf_heading_date, Todaycolumns, data, 'TodayKMSummaryReport');
  }

  Todayexportexcle() {
    let columns = ['ID', 'Vehicle Number', 'Vehicle Type', 'Today Distance (KM)', 'Today Travel Time (HH:MM:SS)', 'This Week Distance (KM)', 'This Week Travel Time (HH:MM:SS)', 'This Month Distance (KM) ', 'This Month Travel Time (HH:MM:SS)'];
    const converted_reportdate = DateUtils.getDisplayTodayDate();
    const converted_reportdateTime = DateUtils.getDisplayTodayDateTime();
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
    worksheet.mergeCells('G1:G3');
    worksheet.addImage(ramkiLogo, 'G1:G3');
    //Add Row and formatting
    worksheet.mergeCells('D1', 'F2');
    let titleRow = worksheet.getCell('D1');
    titleRow.value = 'UTrack Kilometer Summary Report ' + ' ' + converted_reportdate
    titleRow.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells('D3', 'F3');
    let startToendData = worksheet.getCell('D3');
    startToendData.value = 'Report generated at' + ' ' + converted_reportdateTime
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
    headerRow.eachCell((cell) => {
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
    this.TodayELEMENT_DATA.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.vehicle_type);
      row.push(value.today.total_distance);
      row.push(value.today.total_travelled_time);
      row.push(value.this_week.total_distance);
      row.push(value.this_week.total_travelled_time);
      row.push(value.this_month.total_distance);
      row.push(value.this_month.total_travelled_time);
      worksheet.addRow(row)
      i++;
    }),
      worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 22;
    worksheet.getColumn(3).width = 22;
    worksheet.getColumn(4).width = 27;
    worksheet.getColumn(5).width = 35;
    worksheet.getColumn(6).width = 30;
    worksheet.getColumn(7).width = 42;
    worksheet.getColumn(8).width = 31;
    worksheet.getColumn(9).width = 42;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'TodayKMSummaryReport' + '.xlsx');
    })
  }

  selectedDatePDF() {
    const title1 = 'UTrack Kilometer Summary Report ' + DateUtils.getDisplayDate(this.SelectDateKilometerMmanagement.value.selectDate) + '\n';
    const title2 = 'Report generated on ' + DateUtils.getDisplayDateTime(this.SelectDateKilometerMmanagement.value.selectDate);
    const pdf_heading_date = title1.concat(title2);
    let SelectDatecolumns: string[] = ['ID', 'Vehicle Number', 'Vehicle Type', 'Total Distance (KM)', 'Total Travel Time (HH:MM:SS)', 'Max Speed (KMPH)', 'Avg Speed (KMPH)'];
    let data: String[][] = [];

    let i = 1;
    this.SelectELEMENT_DATA.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.vehicle_type);
      row.push(value.today.total_distance);
      row.push(value.today.total_travelled_time);
      row.push(value.today.max_speed);
      row.push(value.today.avg_speed);
      data.push(row);
      i++;
    }),
      PdfUtils.downloadPdf(pdf_heading_date, SelectDatecolumns, data, 'SelectedDateTodayKMSummaryReport');
  }

  SelectedDateExportexcle() {
    let columns = ['ID', 'Vehicle Number', 'Vehicle Type', 'Total Distance (KM)', 'Total Travel Time (HH:MM:SS)', 'Max Speed (KMPH)', 'Avg Speed (KMPH)'];
    const converted_reportdate = DateUtils.getDisplayDate(this.SelectDateKilometerMmanagement.value.selectDate);
    const converted_reportdatetime = DateUtils.getDisplayDateTime(this.SelectDateKilometerMmanagement.value.selectDate);
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
    worksheet.mergeCells('G1:G3');
    worksheet.addImage(ramkiLogo, 'G1:G3');
    //Add Row and formatting
    worksheet.mergeCells('C1', 'F2');

    let titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack Kilometer Summary Report ' + ' ' + converted_reportdate
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
    startToendData.value = 'Report generated at' + ' ' + converted_reportdatetime
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
    headerRow.eachCell((cell) => {
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
    this.SelectELEMENT_DATA.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.vehicle_type);
      row.push(value.today.total_distance);
      row.push(value.today.total_travelled_time);
      row.push(value.today.max_speed);
      row.push(value.today.avg_speed);
      worksheet.addRow(row)
      i++;
    }),
      worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 22;
    worksheet.getColumn(3).width = 22;
    worksheet.getColumn(4).width = 27;
    worksheet.getColumn(5).width = 35;
    worksheet.getColumn(6).width = 23;
    worksheet.getColumn(7).width = 23;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'SelectedDateKMSummaryReport' + '.xlsx');
    })
  }

  customDates_cumulativePdf() {
    const title1 = 'UTrack Kilometer Summary Report \n';
    const title2 = 'From ' + DateUtils.getDisplayDate(this.CustomDatesDataKilometerMmanagement.value.StartDate);
    const title3 = ' TO ' + DateUtils.getDisplayDate(this.CustomDatesDataKilometerMmanagement.value.EndDate);
    const pdf_heading_date = title1.concat(title2).concat(title3);
    let customerTableColumn: string[] = ['ID', 'Vehicle Number', 'Vehicle Type', 'Total Distance(KM)', 'Total Travel Time(HH:MM:SS)', 'Max Speed(KMPH)', 'Avg Speed(KMPH)'];
    let data: String[][] = [];

    let i = 1;
    this.CustomeDate_cumulative_data.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.vehicle_type);
      row.push(value.total_distance);
      row.push(value.total_travelled_time);
      row.push(value.max_speed);
      row.push(value.avg_speed);
      data.push(row);
      i++;
    }),
      PdfUtils.downloadPdf(pdf_heading_date, customerTableColumn, data, 'CustomDatesTodayKMSummaryReport');
  }

  CustomDates_cumulativeExportexcle() {
    let columns = ['ID', 'Vehicle Number', 'Vehicle Type', 'Total Distance (KM)', 'Total Travel Time (HH:MM:SS)', 'Max Speed (KMPH)', 'Avg Speed (KMPH)'];
    const converted_startdate = DateUtils.getDisplayDate(this.CustomDatesDataKilometerMmanagement.value.StartDate);
    const converted_enddate = DateUtils.getDisplayDate(this.CustomDatesDataKilometerMmanagement.value.EndDate);
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

    worksheet.mergeCells('G1:G3');
    worksheet.addImage(ramkiLogo, 'G1:G3');
    //Add Row and formatting
    worksheet.mergeCells('C1', 'F2');

    let titleRow = worksheet.getCell('C1');
    titleRow.value = ' UTrack Kilometer Summary Report'
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
    startToendData.value = 'From ' + converted_startdate + ' To ' + converted_enddate
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
    headerRow.eachCell((cell) => {
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
    this.CustomeDate_cumulative_data.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.vehicle_type)
      row.push(value.total_distance);
      row.push(value.total_travelled_time);
      row.push(value.max_speed);
      row.push(value.avg_speed);
      worksheet.addRow(row)
      i++;
    }),
      worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 22;
    worksheet.getColumn(3).width = 16;
    worksheet.getColumn(4).width = 24;
    worksheet.getColumn(5).width = 34;
    worksheet.getColumn(6).width = 22;
    worksheet.getColumn(7).width = 21;

    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'CustomDatesKMSummaryReport' + '.xlsx');
    })
  }

  customDates_DetailedPdf() {
    const title1 = 'UTrack Kilometer Summary Report \n';
    const title2 = 'From ' + DateUtils.getDisplayDate(this.CustomDatesDataKilometerMmanagement.value.StartDate);
    const title3 = ' TO ' + DateUtils.getDisplayDate(this.CustomDatesDataKilometerMmanagement.value.EndDate);
    const pdf_heading_date = title1.concat(title2).concat(title3);
    let customerTableColumn: string[] = ['ID', 'Vehicle Number', 'Vehicle Type', 'Date', 'Total Distance (KM)', 'Total Travel Time (HH:MM:SS)', 'Max Speed (KMPH)', 'Avg Speed (KMPH)', 'Cumulative Distance (KM)'];
    let data: String[][] = [];

    let i = 1;
    this.CustomeDate_Detail_View.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.vehicle_type);
      row.push(value.report_date);
      row.push(value.total_distance);
      row.push(value.total_travelled_time);
      row.push(value.max_speed);
      row.push(value.avg_speed);
      row.push(value.cumulative_distance);
      data.push(row);
      i++;
    }),
      PdfUtils.downloadPdf(pdf_heading_date, customerTableColumn, data, 'CustomDatesTodayKMSummaryReport');
  }

  CustomDates_DetailedExportexcle() {
    let columns = ['ID', 'Vehicle Number', 'Vehicle Type', 'Date', 'Total Distance (KM)', 'Total Travel Time (HH:MM:SS)', 'Max Speed (KMPH)', 'Avg Speed (KMPH)', 'Cumulative Distance (KM)'];
    const converted_startdate = DateUtils.getDisplayDate(this.CustomDatesDataKilometerMmanagement.value.StartDate);
    const converted_enddate = DateUtils.getDisplayDate(this.CustomDatesDataKilometerMmanagement.value.EndDate);
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
    titleRow.value = ' UTrack Kilometer Summary Report'
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
    startToendData.value = 'From ' + converted_startdate + ' To ' + converted_enddate
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
    headerRow.eachCell((cell) => {
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
    this.CustomeDate_Detail_View.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.vehicle_type)
      row.push(value.report_date)
      row.push(value.total_distance);
      row.push(value.total_travelled_time);
      row.push(value.max_speed);
      row.push(value.avg_speed);
      row.push(value.cumulative_distance)
      worksheet.addRow(row)
      i++;
    }),
      worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 22;
    worksheet.getColumn(3).width = 16;
    worksheet.getColumn(4).width = 12;
    worksheet.getColumn(5).width = 24;
    worksheet.getColumn(6).width = 34;
    worksheet.getColumn(7).width = 22;
    worksheet.getColumn(8).width = 21;
    worksheet.getColumn(9).width = 31;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'CustomDatesKMSummaryReport' + '.xlsx');
    })
  }

  monthKMReportPdf() {
    const title1 = 'UTrack Kilometer Summary Report ' + DateUtils.getDisplayMonth(this.date.value) + '\n';
    const title2 = 'Report generated on ' + DateUtils.getDisplayDateTime(this.date.value);
    const pdf_heading_date = title1.concat(title2);
    let MonthTableColumn: string[] = ['ID', 'Vehicle Number', 'Vehicle Type', 'Month Total Distance (KM)', 'Month Total Travel Time (HH:MM:SS)', 'Max Speed (KMPH)', 'Avg Speed (KMPH)'];
    let data: String[][] = [];

    let i = 1;
    this.MonthDetailsELEMENT_DATA.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.vehicle_type);
      row.push(value.this_month.total_distance);
      row.push(value.this_month.total_travelled_time);
      row.push(value.this_month.max_speed);
      row.push(value.this_month.avg_speed);
      data.push(row);
      i++;
    }),
      PdfUtils.downloadPdf(pdf_heading_date, MonthTableColumn, data, 'SelectedMonthTodayKMSummaryReport');
  }

  MonthExportexcle() {
    let columns = ['ID', 'Vehicle Number', 'Vehicle Type', 'Month Total Distance (KM)', 'Month Total Travel Time (HH:MM:SS)', 'Max Speed (KMPH)', 'Avg Speed (KMPH)'];
    let monthcolumns = ['ID', 'Vehicle Number', 'Vehicle Type',
      '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
      '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
      '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', 'Sum KM'];
    var converted_reportdate = DateUtils.getDisplayMonth(this.date.value);
    var converted_reportdatetime = DateUtils.getDisplayDateTime(this.date.value);
    //Create a workbook with a worksheet
    let workbook = new Workbook();
    var worksheet = workbook.addWorksheet('Monthly Summary KM Report');
    var monthworksheet = workbook.addWorksheet('Monthly Complete KM Report');
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

    worksheet.mergeCells('G1:G3');
    worksheet.addImage(ramkiLogo, 'G1:G3');
    //Add Row and formatting
    worksheet.mergeCells('C1', 'F2');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = ' UTrack Kilometer Summary Report - ' + converted_reportdate
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
    startToendData.value = 'Report generated at' + ' ' + converted_reportdatetime
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
    headerRow.eachCell((cell) => {
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
    this.MonthDetailsELEMENT_DATA.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.vehicle_type);
      row.push(value.this_month.total_distance);
      row.push(value.this_month.total_travelled_time);
      row.push(value.this_month.max_speed);
      row.push(value.this_month.avg_speed);
      worksheet.addRow(row)
      i++;
    }),
      worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 22;
    worksheet.getColumn(3).width = 22;
    worksheet.getColumn(4).width = 32;
    worksheet.getColumn(5).width = 42;
    worksheet.getColumn(6).width = 23;
    worksheet.getColumn(7).width = 23;
    worksheet.addRow([]);
    //Add Image
    let companyLogoImage = workbook.addImage({
      base64: Base64ImageConstants.uTrackLogoWithBG,
      extension: 'png',
    });
    monthworksheet.mergeCells('A1:B3');
    monthworksheet.addImage(companyLogoImage, 'A1:B3')

    let CompanyramkiLogo = workbook.addImage({
      base64: Base64ImageConstants.ramkiLogo,
      extension: 'png',
    });
    monthworksheet.mergeCells('Q1:S3');
    monthworksheet.addImage(CompanyramkiLogo, 'Q1:S3')
    //Add Row and formatting
    monthworksheet.mergeCells('E1', 'N2');
    let monthtitleRow = monthworksheet.getCell('E1');
    monthtitleRow.value = ' UTrack Kilometer Summary Report - ' + converted_reportdate
    monthtitleRow.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    monthtitleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    monthworksheet.mergeCells('E3', 'N3');
    let monthendData = monthworksheet.getCell('E3');
    monthendData.value = 'Report generated at' + ' ( ' + converted_reportdatetime + ' )'
    monthendData.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    monthendData.alignment = { vertical: 'middle', horizontal: 'center' }

    monthworksheet.addRow([]);
    //Adding Header Row
    let monthheaderRow = monthworksheet.addRow(monthcolumns);
    monthheaderRow.eachCell((cell) => {
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
    let j = 1;
    this.MonthDetailsELEMENT_DATA.forEach(function (value) {
      let row: String[] = [];
      let k01 = '-', k02 = '-', k03 = '-', k04 = '-', k05 = '-', k06 = '-', k07 = '-', k08 = '-', k09 = '-', k10 = '-';
      let k11 = '-', k12 = '-', k13 = '-', k14 = '-', k15 = '-', k16 = '-', k17 = '-', k18 = '-', k19 = '-', k20 = '-';
      let k21 = '-', k22 = '-', k23 = '-', k24 = '-', k25 = '-', k26 = '-', k27 = '-', k28 = '-', k29 = '-', k30 = '-', k31 = '-';

      if (value.this_month != undefined && value.this_month.detail != undefined) {

        value.this_month.detail.forEach(function (val) {

          var total_distance = val.total_distance;

          switch (val.day) {
            case "01": k01 = total_distance;
              break

            case "02": k02 = total_distance;
              break

            case "03": k03 = total_distance;
              break

            case "04": k04 = total_distance;
              break

            case "05": k05 = total_distance;
              break

            case "06": k06 = total_distance;
              break

            case "07": k07 = total_distance;
              break

            case "08": k08 = total_distance;
              break

            case "09": k09 = total_distance;
              break

            case "10": k10 = total_distance;
              break

            case "11": k11 = total_distance;
              break

            case "12": k12 = total_distance;
              break

            case "13": k13 = total_distance;
              break

            case "14": k14 = total_distance;
              break

            case "15": k15 = total_distance;
              break

            case "16": k16 = total_distance;
              break

            case "17": k17 = total_distance;
              break

            case "18": k18 = total_distance;
              break

            case "19": k19 = total_distance;
              break

            case "20": k20 = total_distance;
              break

            case "21": k21 = total_distance;
              break

            case "22": k22 = total_distance;
              break

            case "23": k23 = total_distance;
              break

            case "24": k24 = total_distance;
              break

            case "25": k25 = total_distance;
              break

            case "26": k26 = total_distance;
              break

            case "27": k27 = total_distance;
              break

            case "28": k28 = total_distance;
              break

            case "29": k29 = total_distance;
              break

            case "30": k30 = total_distance;
              break

            case "31": k31 = total_distance;
              break
          }
        })
      }

      row.push(j.toString());
      row.push(value.vehicle_number);
      row.push(value.vehicle_type);
      row.push(k01);
      row.push(k02);
      row.push(k03);
      row.push(k04);
      row.push(k05);
      row.push(k06);
      row.push(k07);
      row.push(k08);
      row.push(k09);
      row.push(k10);
      row.push(k11);
      row.push(k12);
      row.push(k13);
      row.push(k14);
      row.push(k15);
      row.push(k16);
      row.push(k17);
      row.push(k18);
      row.push(k19);
      row.push(k20);
      row.push(k21);
      row.push(k22);
      row.push(k23);
      row.push(k24);
      row.push(k25);
      row.push(k26);
      row.push(k27);
      row.push(k28);
      row.push(k29);
      row.push(k30);
      row.push(k31);
      row.push(value.this_month.total_distance);
      monthworksheet.addRow(row)
      j++;
    }),

      monthworksheet.getColumn(1).width = 5;
    monthworksheet.getColumn(2).width = 22;
    monthworksheet.getColumn(3).width = 16;
    monthworksheet.getColumn(4).width = 8;
    monthworksheet.getColumn(5).width = 8;
    monthworksheet.getColumn(6).width = 8;
    monthworksheet.getColumn(7).width = 8;
    monthworksheet.getColumn(8).width = 8;
    monthworksheet.getColumn(9).width = 8;
    monthworksheet.getColumn(10).width = 8;
    monthworksheet.getColumn(11).width = 8;
    monthworksheet.getColumn(12).width = 8;
    monthworksheet.getColumn(13).width = 8;
    monthworksheet.getColumn(14).width = 8;
    monthworksheet.getColumn(15).width = 8;
    monthworksheet.getColumn(16).width = 8;
    monthworksheet.getColumn(17).width = 8;
    monthworksheet.getColumn(18).width = 8;
    monthworksheet.getColumn(19).width = 8;
    monthworksheet.getColumn(20).width = 8;
    monthworksheet.getColumn(21).width = 8;
    monthworksheet.getColumn(22).width = 8;
    monthworksheet.getColumn(23).width = 8;
    monthworksheet.getColumn(24).width = 8;
    monthworksheet.getColumn(25).width = 8;
    monthworksheet.getColumn(26).width = 8;
    monthworksheet.getColumn(27).width = 8;
    monthworksheet.getColumn(28).width = 8;
    monthworksheet.getColumn(29).width = 8;
    monthworksheet.getColumn(30).width = 8;
    monthworksheet.getColumn(31).width = 8;
    monthworksheet.getColumn(32).width = 8;
    monthworksheet.getColumn(33).width = 8;
    monthworksheet.getColumn(34).width = 8;
    monthworksheet.getColumn(35).width = 15;
    monthworksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'MonthKMSummaryReport' + '.xlsx');
    })
  }

  getTodayList() {
    this.uTrackService.new_all_device_report_stats_v1(DateUtils.getServerDateFromDate(this.todayDate))
      .subscribe(response => {
        this.TodayELEMENT_DATA = [];
        if (response.status && response.data != undefined && response.data != null && response.data.length > 0) {
          this.TodayTableDataNotshow=false;
          this.TodayELEMENT_DATA = response.data
          this.TodayELEMENT_DATA.forEach((val) => {
            switch (val.vehicle_type) {
              case "Car":
                val.Todaylistimage = "assets/images/data_list_icons/marker_type_green_car.png";
                break;
              case "Bus":
                val.Todaylistimage = "assets/images/data_list_icons/marker_type_green_bus.png";
                break;
              case "Truck":
                val.Todaylistimage = "assets/images/data_list_icons/marker_type_green_truck.png";
                break;
              case "Auto":
                val.Todaylistimage = "assets/images/data_list_icons/marker_type_green_auto.png";
                break;
              case "Bike":
                val.Todaylistimage = "assets/images/data_list_icons/marker_type_green_bike.png";
                break;
              case "Mobile":
                val.Todaylistimage = "assets/images/data_list_icons/marker_type_green_mobile.png";
                break;
              case "IDCard":
                val.Todaylistimage = "assets/images/data_list_icons/marker_type_green_id.png";
                break;
              case "Scooty":
                val.Todaylistimage = "assets/images/data_list_icons/marker_type_scooty_green.png";
                break;
              case "Train":
                val.Todaylistimage = "assets/images/data_list_icons/marker_type_train_green.png";
                break;
            }
          })
          this.getSelectDate();
          this.getMonthList();
          this.todaydataSource.data = this.TodayELEMENT_DATA;
        }else{
          this.getSelectDate();
          this.getMonthList();
          this.TodayTableDataNotshow=true;
        }
      })
  }

  getSelectDate() {

    this.uTrackService.new_all_device_report_stats_v1(DateUtils.getServerDateFromDate(this.SelectDateKilometerMmanagement.value.selectDate))
      .subscribe(response => {
        this.SelectELEMENT_DATA = []
        if (response.status && response.data != undefined && response.data != null && response.data.length > 0) {
          this.SelectDateTableDataNotshow=false;
          this.SelectELEMENT_DATA = response.data
          this.SelectELEMENT_DATA.forEach((val) => {
            switch (val.vehicle_type) {
              case "Car":
                val.SelectDatelistimage = "assets/images/data_list_icons/marker_type_green_car.png";
                break;
              case "Bus":
                val.SelectDatelistimage = "assets/images/data_list_icons/marker_type_green_bus.png";
                break;
              case "Truck":
                val.SelectDatelistimage = "assets/images/data_list_icons/marker_type_green_truck.png";
                break;
              case "Auto":
                val.SelectDatelistimage = "assets/images/data_list_icons/marker_type_green_auto.png";
                break;
              case "Bike":
                val.SelectDatelistimage = "assets/images/data_list_icons/marker_type_green_bike.png";
                break;
              case "Mobile":
                val.SelectDatelistimage = "assets/images/data_list_icons/marker_type_green_mobile.png";
                break;
              case "IDCard":
                val.SelectDatelistimage = "assets/images/data_list_icons/marker_type_green_id.png";
                break;
              case "Scooty":
                val.SelectDatelistimage = "assets/images/data_list_icons/marker_type_scooty_green.png";
                break;
              case "Train":
                val.SelectDatelistimage = "assets/images/data_list_icons/marker_type_train_green.png";
                break;
            }
          })
          this.SelectDatedataSource.data = this.SelectELEMENT_DATA;
        }else{
          this.SelectDateTableDataNotshow=true;
        }
      })
  }

  viewReport() {
    const start_date = DateUtils.getServerDateTime(this.CustomDatesDataKilometerMmanagement.value.StartDate);
    const end_date = DateUtils.getServerDateTime(this.CustomDatesDataKilometerMmanagement.value.EndDate);
    const start_milli_sec = DateUtils.getDateDifference(this.CustomDatesDataKilometerMmanagement.value.StartDate);
    const end_milli_sec = DateUtils.getDateDifference(this.CustomDatesDataKilometerMmanagement.value.EndDate);
    
    if (start_date > end_date) {
      this.toasterService.danger('', 'Start date should be less than End date.');
    } else if ((end_milli_sec - start_milli_sec) > 3888000000) {
      this.toasterService.danger('', 'Difference between start and end date should be less than 45 days');
    } else {
      this.getCustomDatesData();
    }
  }

  getCustomDatesData() {
    this.uTrackService.all_device_report_stats_custom_v1(DateUtils.getServerDateFromDate(this.CustomDatesDataKilometerMmanagement.value.StartDate),
    DateUtils.getServerDateFromDate(this.CustomDatesDataKilometerMmanagement.value.EndDate)).subscribe(response => {
      this.CustomeDate_cumulative_data = []   
      this.CustomeDate_Detail_View = []  
      if (response.status && response.data != undefined && response.data != null && response.data.length > 0) {
        this.cumulativeTableDataNotshow=false;
        this.CustomeDetailsTableDataNotshow=false;
        response.data.forEach((val) => {
          switch (val.vehicle_type) {
            case "Car":
              val.CustomeDatelistimage = "assets/images/data_list_icons/marker_type_green_car.png";
              break;
            case "Bus":
              val.CustomeDatelistimage = "assets/images/data_list_icons/marker_type_green_bus.png";
              break;
            case "Truck":
              val.CustomeDatelistimage = "assets/images/data_list_icons/marker_type_green_truck.png";
              break;
            case "Auto":
              val.CustomeDatelistimage = "assets/images/data_list_icons/marker_type_green_auto.png";
              break;
            case "Bike":
              val.CustomeDatelistimage = "assets/images/data_list_icons/marker_type_green_bike.png";
              break;
            case "Mobile":
              val.CustomeDatelistimage = "assets/images/data_list_icons/marker_type_green_mobile.png";
              break;
            case "IDCard":
              val.CustomeDatelistimage = "assets/images/data_list_icons/marker_type_green_id.png";
              break;
            case "Scooty":
              val.CustomeDatelistimage = "assets/images/data_list_icons/marker_type_scooty_green.png";
              break;
            case "Train":
              val.CustomeDatelistimage = "assets/images/data_list_icons/marker_type_train_green.png";
              break;
          }
          if (val.detail != null && val.detail != undefined && val.detail.length > 0) {
            val.detail.forEach((row) => {
              row.cumulative_distance = val.total_distance;
              row.vehicle_type = val.vehicle_type;
              row.vehicle_number = val.vehicle_number;
              row.device_id = val.device_id;
              row.device_link_id = val.device_link_id;
              this.CustomeDate_Detail_View.push(row);
            })
          }
          this.CustomeDate_cumulative_data.push(val)
        })
        this.CustomeDate_cumulative_dataSource.data = this.CustomeDate_cumulative_data
        this.Custome_Detail_View_data_Source.data = this.CustomeDate_Detail_View;
      }else{
        this.cumulativeTableDataNotshow=true;
        this.CustomeDetailsTableDataNotshow=true;
      }
    })

  }


  New_trackHistory(deviceLinkId, report_date_formatted) {
    this.routes.navigate([`web/track_history`, deviceLinkId, DateUtils.getServerDate(report_date_formatted)])
    { relativeTo: this.activatedRoute }
  }

  public monthDate: any;
  getMonthList() {
    this.monthDate = this.date.value._d
    this.uTrackService.new_all_device_report_stats_v1(DateUtils.getServerDateFromDate(this.monthDate))
      .subscribe(response => {
        this.MonthDetailsELEMENT_DATA = [];
        if (response.status && response.data != undefined && response.data != null && response.data.length > 0) {
          this.MonthDatelisTableDataNotshow=false;
          this.MonthDetailsELEMENT_DATA = response.data
          this.MonthDetailsELEMENT_DATA.forEach((val) => {
            switch (val.vehicle_type) {
              case "Car":
                val.MonthDatelistimage = "assets/images/data_list_icons/marker_type_green_car.png";
                break;
              case "Bus":
                val.MonthDatelistimage = "assets/images/data_list_icons/marker_type_green_bus.png";
                break;
              case "Truck":
                val.MonthDatelistimage = "assets/images/data_list_icons/marker_type_green_truck.png";
                break;
              case "Auto":
                val.MonthDatelistimage = "assets/images/data_list_icons/marker_type_green_auto.png";
                break;
              case "Bike":
                val.MonthDatelistimage = "assets/images/data_list_icons/marker_type_green_bike.png";
                break;
              case "Mobile":
                val.MonthDatelistimage = "assets/images/data_list_icons/marker_type_green_mobile.png";
                break;
              case "IDCard":
                val.MonthDatelistimage = "assets/images/data_list_icons/marker_type_green_id.png";
                break;
              case "Scooty":
                val.MonthDatelistimage = "assets/images/data_list_icons/marker_type_scooty_green.png";
                break;
              case "Train":
                val.MonthDatelistimage = "assets/images/data_list_icons/marker_type_train_green.png";
                break;
            }
          })
          this.MonthDetailsdataSource.data = this.MonthDetailsELEMENT_DATA;
        }else{
          this.MonthDatelisTableDataNotshow=true;
        }
      })
  }

  OpenVehicleDetails(model_data: AllDeviceReport) {
    let rowData = JSON.stringify(model_data)
    let dialogReference = this.dialog.open(ShowVehicleDetailsComponent, {
      height: '95%',
      width: '69%',
      data: { vehicle_number: rowData }
    })
    dialogReference.afterClosed().subscribe(() => {
      dialogReference.close()
    })
  }

  OpenCustomDetails(model_data: AllDeviceReportStatsCustom) {
    let rowData = JSON.stringify(model_data)
    let dialogReference = this.dialog.open(ShowCustomDateComponent, {
      height: '95%',
      width: '69%',
      data: { vehicle_number: rowData }
    })

    dialogReference.afterClosed().subscribe(() => {
      dialogReference.close()
    })
  }

  Cumulative_View() {
    this.cumulative = true;
    this.detailed = false;
  }

  Detail_View() {
    this.detailed = true;
    this.cumulative = false;
  }

  todayVehicleGraphView(){
    let dialogReference = this.dialog.open(TodayVehicleGraphViewComponent, {
      height: '80%',
      width: '69%',
      data: this.TodayELEMENT_DATA 
    })

    dialogReference.afterClosed().subscribe(() => {
      dialogReference.close()
    })  
  }

  selectDateVehicleGraphView(){
    let dialogReference = this.dialog.open(SelectDateVehicleGraphViewComponent, {
      height: '80%',
      width: '69%',
      data: this.SelectELEMENT_DATA 
    })

    dialogReference.afterClosed().subscribe(() => {
      dialogReference.close()
    })  
  }

  cumulativeVehicleGraphView(){
    let dialogReference = this.dialog.open(CumulativeGraphViewComponent, {
      height: '80%',
      width: '69%',
      data: this.CustomeDate_cumulative_data 
    })

    dialogReference.afterClosed().subscribe(() => {
      dialogReference.close()
    })  
  }

  detailVehicleGraphView(){
    let dialogReference = this.dialog.open(DetailGraphViewComponent, {
      height: '80%',
      width: '69%',
      data: this.CustomeDate_Detail_View 
    })

    dialogReference.afterClosed().subscribe(() => {
      dialogReference.close()
    })  
  }

  selectMonthVehicleGraphView(){
    let dialogReference = this.dialog.open(SelectMonthGraphViewComponent, {
      height: '80%',
      width: '69%',
      data: this.MonthDetailsELEMENT_DATA 
    })

    dialogReference.afterClosed().subscribe(() => {
      dialogReference.close()
    })  
  }
}

