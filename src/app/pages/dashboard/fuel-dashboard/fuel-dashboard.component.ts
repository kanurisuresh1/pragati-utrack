import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Location } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HomeLiteV1Data } from '../../../@theme/components/Model/HomeLiteV1Response';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';

import { FuelRefilResponseData, RefillEntityOrTheftEntity } from '../../../@theme/components/Model/FuelRefilResponse';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { ActivatedRoute, Router } from '@angular/router';
import { NbThemeService, NbToastrService } from '@nebular/theme';
import { FuelReportResponseData } from '../../../@theme/components/Model/FuelReportResponse';
import { OpenDetailsComponent } from '../open-details/open-details.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomFuelDashboardResponseData, FuelDashboardResponseData } from '../../../@theme/components/Model/FuelDashboardResponse';

export const MY_FORMATS = {
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};

@Component({
  selector: 'ngx-fuel-dashboard',
  templateUrl: './fuel-dashboard.component.html',
  styleUrls: ['./fuel-dashboard.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class FuelDashboardComponent implements OnInit {
  DailyFuleReportDataNotshow: boolean;
  customeFuleDataNotshow: boolean;
  TheftFuleReportDataNotshow: boolean;
  GraphDataNotshow: boolean;
  RefilFuelDataNotshow: boolean;
  FuleRawDataNotshow: boolean;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  options: any = {};
  themeSubscription: any;
  ELEMENT_DATA: FuelReportResponseData[] = [];
  displayedColumns: string[] = ['id', 'date_time', 'fuel', 'latitude', 'longitude', 'landmark'];
  dataSource = new MatTableDataSource<FuelReportResponseData>(this.ELEMENT_DATA)

  vehicles: HomeLiteV1Data[] = [];

  deviceLinkId: string;
  vehicle_name: string;

  startDate = new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000));
  endDate = new Date();
  currentDate = new Date();

  DAILY_FUEL_ELEMENT_DATA: FuelDashboardResponseData[] = [];
  daily_fuel_displayedColumns: string[] = ['id', 'vehicle_number', 'date', 'weekDayName',
    'travel_distance', 'fuel_consumed', 'mileage', 'refills_count', 'refil_fuel',
    'rate_per_ltr', 'amount_spent_refil', 'theft_count', 'theft_removed', 'loss_amount_due_theft', 'start_fuel_level', 'eod_fuel_level'];
  daily_fuel_dataSource = new MatTableDataSource<FuelDashboardResponseData>(this.DAILY_FUEL_ELEMENT_DATA);


  CUSTOM_FUEL_ELEMENT_DATA_NEW: CustomFuelDashboardResponseData[] = [];
  custom_fuel_displayedColumns: string[] = ['id', 'from_date', 'to_date', 'vehicle_number',
    'travel_distance', 'fuel_consumed', 'mileage', 'refills_count', 'refil_fuel',
    'rate_per_ltr', 'amount_spent_refil', 'theft_count', 'theft_removed', 'loss_amount_due_theft',];
  custom_fuel_dataSource = new MatTableDataSource<CustomFuelDashboardResponseData>(this.CUSTOM_FUEL_ELEMENT_DATA_NEW);

  REFIL_FUEL_ELEMENT_DATA: RefillEntityOrTheftEntity[] = [];
  refil_fuel_displayedColumns: string[] = ['id', 'vehicle_number', 'date', 'weekDayName', 'refil_fuel','LatLang',
  'location', 'filling_station_name', 'rate_per_ltr', 'amount_spent_refil'];
  refil_fuel_dataSource = new MatTableDataSource<RefillEntityOrTheftEntity>(this.REFIL_FUEL_ELEMENT_DATA);

  THEFT_FUEL_ELEMENT_DATA: RefillEntityOrTheftEntity[] = [];
  theft_fuel_displayedColumns: string[] = ['id', 'vehicle_number', 'date', 'location', 'theft_removed',
    'loss_amount_due_theft'];
  theft_fuel_dataSource = new MatTableDataSource<RefillEntityOrTheftEntity>(this.THEFT_FUEL_ELEMENT_DATA);
  Fuel_Total_Amount: number;

  constructor(
    private headerService: HeaderInteractorService,
    private uTrackService: UtrackService,
    private routes: Router,
    private activatedRoute: ActivatedRoute,
    private theme: NbThemeService,
    private dialog: MatDialog,
    private location: Location,
    private toasterService: NbToastrService,
  ) { }

  ngOnInit(): void {
    this.headerService.updateHeaderTitle('HEADER_NAMES.Fuel Dashboard');
    this.uTrackService.translateLanguage();
    this.uTrackService.isUserValid();
    this.daily_fuel_dataSource.sort = this.sort;
    this.refil_fuel_dataSource.sort = this.sort;
    this.theft_fuel_dataSource.sort = this.sort;
    this.getVehicles();
  }

  fuelSelectionForm = new FormGroup({
    vechicleName: new FormControl(),
    startDate: new FormControl(this.startDate),
    endDate: new FormControl(this.endDate)
  })

  getVehicles() {
    this.uTrackService.home_lite_v1().subscribe(response => {
      this.vehicles = [];
      if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
        response.data.forEach(element => {
          if (element.product_type == "Fuel" || element.product_type == "FuelTemp") {
            this.vehicles.push(element);
            this.deviceLinkId = this.vehicles[0].device_link_id
            this.vehicle_name = this.vehicles[0].vehicle_number;
          }
        })
        this.get_vehicle_fuel_summary();
        this.get_vehicle_fuel_refill();
        this.new_track_report_web_mongo_fuel_v1();
      }
      if (this.vehicles.length > 0) {
        this.DailyFuleReportDataNotshow = false;
        this.customeFuleDataNotshow = false;
        this.TheftFuleReportDataNotshow = false;
        this.GraphDataNotshow = false;
        this.RefilFuelDataNotshow = false;
        this.FuleRawDataNotshow = false;
      } else {
        this.DailyFuleReportDataNotshow = true;
        this.customeFuleDataNotshow = true;
        this.TheftFuleReportDataNotshow = true;
        this.GraphDataNotshow = true;
        this.RefilFuelDataNotshow = true;
        this.FuleRawDataNotshow = true;
      }
    })
  }

  get_vehicle_fuel_refill() {
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem("USER_ID"));
    formData.append('user_type', localStorage.getItem("USER_TYPE"));
    formData.append('device_token', "Web");
    formData.append('start_date', DateUtils.getServerDateTime(this.fuelSelectionForm.value.startDate));
    formData.append('end_date', DateUtils.getServerDateTime(this.fuelSelectionForm.value.endDate));
    formData.append('device_link_id', this.deviceLinkId)
    this.uTrackService.get_vehicle_fuel_refill(formData).subscribe(response => {
      this.REFIL_FUEL_ELEMENT_DATA = [];
      this.THEFT_FUEL_ELEMENT_DATA = [];
      if (response.status && response.data != null && response.data != undefined) {
        this.RefilFuelDataNotshow = false;
        this.TheftFuleReportDataNotshow = false;
        if ( response.data.Refill != null && response.data.Refill != undefined && response.data.Refill.length > 0) {
          this.RefilFuelDataNotshow = false;
          this.REFIL_FUEL_ELEMENT_DATA = response.data.Refill;
        } else {
          this.RefilFuelDataNotshow = true;
        }
        if (response.data.Theft != null && response.data.Theft != undefined && response.data.Theft.length > 0) {
          this.TheftFuleReportDataNotshow = false;
          this.THEFT_FUEL_ELEMENT_DATA = response.data.Theft;
        } else {
          this.TheftFuleReportDataNotshow = true;
        }
      }else{
        this.RefilFuelDataNotshow = true;
        this.TheftFuleReportDataNotshow = true;
      }
      this.refil_fuel_dataSource.data = this.REFIL_FUEL_ELEMENT_DATA;
      this.theft_fuel_dataSource.data = this.THEFT_FUEL_ELEMENT_DATA;
    })
  }

  get_vehicle_fuel_summary() {
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem("USER_ID"));
    formData.append('user_type', localStorage.getItem("USER_TYPE"));
    formData.append('device_token', "Web");
    formData.append('start_date', DateUtils.getServerDateTime(this.fuelSelectionForm.value.startDate));
    formData.append('end_date', DateUtils.getServerDateTime(this.fuelSelectionForm.value.endDate));
    formData.append('device_link_id', this.deviceLinkId)
    this.uTrackService.get_vehicle_fuel_summary(formData).subscribe(response => {
      this.DAILY_FUEL_ELEMENT_DATA = [];
      this.CUSTOM_FUEL_ELEMENT_DATA_NEW = [];
      if (response.status && response.data != null && response.data != undefined &&
        response.data.detail != null && response.data.detail.length > 0) {
        this.DailyFuleReportDataNotshow = false;
        this.customeFuleDataNotshow = false;
        this.DAILY_FUEL_ELEMENT_DATA = response.data.detail;
        response.data.start_date = DateUtils.getDisplayDateFromDate(this.fuelSelectionForm.value.startDate);
        response.data.end_date = DateUtils.getDisplayDateFromDate(this.fuelSelectionForm.value.endDate);
        this.CUSTOM_FUEL_ELEMENT_DATA_NEW.push(response.data)
      } else {
        this.DailyFuleReportDataNotshow = true;
        this.customeFuleDataNotshow = true;
      }
      this.daily_fuel_dataSource.data = this.DAILY_FUEL_ELEMENT_DATA;
      this.custom_fuel_dataSource.data = this.CUSTOM_FUEL_ELEMENT_DATA_NEW;
    });
  }

  changeVehicle(row) {
    this.deviceLinkId = row.device_link_id;
    this.vehicle_name = row.vehicle_number;
    this.get_vehicle_fuel_summary();
    this.get_vehicle_fuel_refill();
    this.new_track_report_web_mongo_fuel_v1();
  }

  back() {
    this.location.back()
  }

  submit() {
    this.get_vehicle_fuel_summary();
    this.get_vehicle_fuel_refill();
    this.new_track_report_web_mongo_fuel_v1();
  }

  daily_fuel_refresh() {
    this.get_vehicle_fuel_summary();
  }

  custom_fuel_refresh() {
    this.get_vehicle_fuel_summary();
  }

  fuel_refil_refresh() {
    this.get_vehicle_fuel_refill();
  }

  fuel_theft_refresh() {
    this.get_vehicle_fuel_refill();
  }

  // Excel and Pdf
  dailyFuelReportExcel() {

    const columns = ['ID', 'Vehicle Number', 'Date', 'Day', 'Travel Distance (KM)', 'Fuel Consumed (Ltrs)', 'Mileage', ' No of Refills ', 'Refill Fuel (Ltrs)',
      'Rate of Fuel Per Ltr', 'Amount Spent on Refill', 'No of Removals', ' Theft/Removed (Ltrs)', 'Loss Amount due to Theft', 'Start Fule Level (Ltrs)', 'EOD Fule Level (Ltrs)'];
    const fuel_refil_columns = ['ID', 'Vehicle Number', 'Refill Date Time', 'Refill Day', 'Refill Fuel (Liters)','LatLng', 'Nearest Location', 'Filling Station Name',  'Rate of Fuel Per Ltr', 'Amount Spent on Refill'];

    const mainTitle = 'Pragati UTrack Daily Fuel Report';
    const title_dates = DateUtils.getDisplayDateTimeFromDate(new Date());

    const workbook = new Workbook();
    const daily_worksheet = workbook.addWorksheet('Daily Fuel Report');
    const fuel_refill_worksheet = workbook.addWorksheet('Fuel Refill Report');
    const custom_fuel_work_sheet = workbook.addWorksheet('Custom Fuel Report');

    const myLogoImage = workbook.addImage({
      base64: Base64ImageConstants.uTrackLogoWithBG,
      extension: 'png',
    });

    const ramkiLogo = workbook.addImage({
      base64: Base64ImageConstants.ramkiLogo,
      extension: 'png',
    });

    daily_worksheet.mergeCells('A1:B3');
    daily_worksheet.addImage(myLogoImage, 'A1:B3');

    daily_worksheet.mergeCells('G1:H3');
    daily_worksheet.addImage(ramkiLogo, 'G1:H3');

    daily_worksheet.mergeCells('C1', 'E2');

    const titleRow = daily_worksheet.getCell('C1');
    titleRow.value = mainTitle,
      titleRow.font = {
        name: 'Calibri',
        size: 18,
        underline: 'single',
        bold: true,
        color: { argb: '0085A3' },
      };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

    daily_worksheet.mergeCells('C3', 'E3');
    const startToendData = daily_worksheet.getCell('C3');
    startToendData.value = title_dates;
    startToendData.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' },
    };
    startToendData.alignment = { vertical: 'middle', horizontal: 'center' };

    daily_worksheet.addRow([]);

    const headerRow = daily_worksheet.addRow(columns);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 14,
      };
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' },
        bottom: { style: 'thin' }, right: { style: 'thin' },
      };
    });

    // Adding Data with Conditional Formatting
    let i = 1;
    this.DAILY_FUEL_ELEMENT_DATA.forEach(value => {
      const row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.report_date);
      row.push(value.report_day);
      row.push(value.total_km);
      row.push(value.total_fuel_consumed);
      row.push(value.average_mileage);
      row.push(value.refills_count);
      row.push(value.refills_liters);
      row.push(value.rate_of_fuel_per_liter);
      row.push(value.total_amount_spent_on_fuel);
      row.push(value.theft_count);
      row.push(value.theft_liters);
      row.push(value.total_amount_loss_due_to_theft);
      row.push(value.start_fuel);
      row.push(value.end_fuel);
      daily_worksheet.addRow(row);
      i++;
    }),

      daily_worksheet.getColumn(1).width = 5;
    daily_worksheet.getColumn(2).width = 23;
    daily_worksheet.getColumn(3).width = 17;
    daily_worksheet.getColumn(4).width = 17;
    daily_worksheet.getColumn(5).width = 23;
    daily_worksheet.getColumn(6).width = 23;
    daily_worksheet.getColumn(7).width = 15;
    daily_worksheet.getColumn(8).width = 21;
    daily_worksheet.getColumn(9).width = 23;
    daily_worksheet.getColumn(10).width = 24;
    daily_worksheet.getColumn(11).width = 22;
    daily_worksheet.getColumn(12).width = 33;
    daily_worksheet.getColumn(13).width = 23;
    daily_worksheet.getColumn(14).width = 24;
    daily_worksheet.getColumn(15).width = 24;
    daily_worksheet.getColumn(16).width = 24;
    daily_worksheet.addRow([]);


    const myLogoImage_fuel_refil = workbook.addImage({
      base64: Base64ImageConstants.uTrackLogoWithBG,
      extension: 'png',
    });

    const ramkiLogo_fuel_refil = workbook.addImage({
      base64: Base64ImageConstants.ramkiLogo,
      extension: 'png',
    });

    const mainTitle_fuel_refil = 'Pragati UTrack Fuel Refill Report';
    const title_dates_fuel_refil = DateUtils.getDisplayDateTimeFromDate(new Date());

    fuel_refill_worksheet.mergeCells('A1:B3');
    fuel_refill_worksheet.addImage(myLogoImage_fuel_refil, 'A1:B3');

    fuel_refill_worksheet.mergeCells('G1:H3');
    fuel_refill_worksheet.addImage(ramkiLogo_fuel_refil, 'G1:H3');

    fuel_refill_worksheet.mergeCells('C1', 'F2');

    const titleRow_fuel_refil = fuel_refill_worksheet.getCell('C1');
    titleRow_fuel_refil.value = mainTitle_fuel_refil,
      titleRow_fuel_refil.font = {
        name: 'Calibri',
        size: 18,
        underline: 'single',
        bold: true,
        color: { argb: '0085A3' },
      };
    titleRow_fuel_refil.alignment = { vertical: 'middle', horizontal: 'center' };

    fuel_refill_worksheet.mergeCells('C3', 'F3');
    const startToendData_fuel_refil = fuel_refill_worksheet.getCell('C3');
    startToendData_fuel_refil.value = title_dates_fuel_refil;
    startToendData_fuel_refil.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' },
    };
    startToendData_fuel_refil.alignment = { vertical: 'middle', horizontal: 'center' };

    fuel_refill_worksheet.addRow([]);

    const headerRow_fuel_refil = fuel_refill_worksheet.addRow(fuel_refil_columns);
    headerRow_fuel_refil.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 14,
      };
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' },
        bottom: { style: 'thin' }, right: { style: 'thin' },
      };
    });

    // Adding Data with Conditional Formatting
    let i1 = 1;
    this.REFIL_FUEL_ELEMENT_DATA.forEach(value => {
      const row: String[] = [];
      row.push(i1.toString());
      row.push(value.vehicle_number);
      row.push(value.report_date);
      row.push(value.report_day);
      row.push(value.fuel_change_liters);
      row.push(value.latlng);
      row.push(value.landmark);
      row.push(value.filling_station_name);
      row.push(value.rate_of_fuel_per_liter);
      row.push(value.fuel_amount);
      fuel_refill_worksheet.addRow(row);
      i++;
    }),

      fuel_refill_worksheet.getColumn(1).width = 5;
    fuel_refill_worksheet.getColumn(2).width = 23;
    fuel_refill_worksheet.getColumn(3).width = 25;
    fuel_refill_worksheet.getColumn(4).width = 25;
    fuel_refill_worksheet.getColumn(5).width = 20;
    fuel_refill_worksheet.getColumn(6).width = 30;
    fuel_refill_worksheet.getColumn(7).width = 60;
    fuel_refill_worksheet.getColumn(8).width = 23;
    fuel_refill_worksheet.getColumn(9).width = 27;
    fuel_refill_worksheet.addRow([]);

    const custom_fuel_columns = ['ID', 'Start Date', 'End Date', 'Vehicle Number', 'Travel Distance (KM)', 'Fuel Consumed (Ltrs)', 'Mileage',
      'No of Refills ', 'Refill Fuel (Ltrs)', 'Rate of Fuel Per Ltr', 'Amount Spent on Refill',
      'No of Removals', 'Theft/Removed (Ltrs)', 'Loss Amount due to Theft'];

    const custom_mainTitle = 'Pragati UTrack Custom Fuel Report';
    const custom_title_dates = DateUtils.getDisplayDateTimeFromDate(new Date());

    const custom_myLogoImage = workbook.addImage({
      base64: Base64ImageConstants.uTrackLogoWithBG,
      extension: 'png',
    });

    const custom_ramkiLogo = workbook.addImage({
      base64: Base64ImageConstants.ramkiLogo,
      extension: 'png',
    });

    custom_fuel_work_sheet.mergeCells('A1:B3');
    custom_fuel_work_sheet.addImage(custom_myLogoImage, 'A1:B3');

    custom_fuel_work_sheet.mergeCells('G1:H3');
    custom_fuel_work_sheet.addImage(custom_ramkiLogo, 'G1:H3');

    custom_fuel_work_sheet.mergeCells('C1', 'E2');

    const custom_titleRow = custom_fuel_work_sheet.getCell('C1');
    custom_titleRow.value = custom_mainTitle,
      custom_titleRow.font = {
        name: 'Calibri',
        size: 18,
        underline: 'single',
        bold: true,
        color: { argb: '0085A3' },
      };
    custom_titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

    custom_fuel_work_sheet.mergeCells('C3', 'E3');
    const custom_startToendData = custom_fuel_work_sheet.getCell('C3');
    custom_startToendData.value = custom_title_dates;
    custom_startToendData.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' },
    };
    custom_startToendData.alignment = { vertical: 'middle', horizontal: 'center' };

    custom_fuel_work_sheet.addRow([]);

    const custom_headerRow = custom_fuel_work_sheet.addRow(custom_fuel_columns);
    custom_headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 14,
      };
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' },
        bottom: { style: 'thin' }, right: { style: 'thin' },
      };
    });

    // Adding Data with Conditional Formatting

    let i2 = 1;
    this.CUSTOM_FUEL_ELEMENT_DATA_NEW.forEach(value => {
      const row: String[] = [];
      row.push(i2.toString());
      row.push(value.start_date);
      row.push(value.end_date);
      row.push(value.vehicle_number);
      row.push(value.total_km);
      row.push(value.total_fuel_consumed);
      row.push(value.average_mileage);
      row.push(value.refills_count);
      row.push(value.refills_liters);
      row.push('-');
      row.push(value.total_amount_spent_on_fuel);
      row.push(value.theft_count);
      row.push(value.theft_liters);
      row.push(value.total_amount_loss_due_to_theft);
      custom_fuel_work_sheet.addRow(row);
      i++;
    }),

      custom_fuel_work_sheet.getColumn(1).width = 5;
    custom_fuel_work_sheet.getColumn(2).width = 23;
    custom_fuel_work_sheet.getColumn(3).width = 23;
    custom_fuel_work_sheet.getColumn(4).width = 23;
    custom_fuel_work_sheet.getColumn(5).width = 23;
    custom_fuel_work_sheet.getColumn(6).width = 23;
    custom_fuel_work_sheet.getColumn(7).width = 15;
    custom_fuel_work_sheet.getColumn(8).width = 21;
    custom_fuel_work_sheet.getColumn(9).width = 23;
    custom_fuel_work_sheet.getColumn(10).width = 24;
    custom_fuel_work_sheet.getColumn(11).width = 22;
    custom_fuel_work_sheet.getColumn(12).width = 33;
    custom_fuel_work_sheet.getColumn(13).width = 23;
    custom_fuel_work_sheet.getColumn(14).width = 24;
    custom_fuel_work_sheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Fuel_Report_' + this.vehicle_name + '.xlsx');
    });

  }

  dailyFuelReportPdf() {
    const title1 = 'Pragati UTrack Daily Fuel Report \n Report generated on ';
    const title2 = DateUtils.getDisplayDateTimeFromDate(new Date());
    const pdf_heading_date = title1.concat(title2);

    const Columns: string[] = ['ID', 'Vehicle Number', 'Date', 'Day', 'Travel Distance (KM)', 'Fuel Consumed (Ltrs)', 'Mileage', 'No of Refills', 'Refill Fuel (Ltrs)',
      'Rate of Fuel Per Ltr', 'Amount Spent on Refill', 'No of Removals', ' Theft/Removed (Ltrs)', 'Loss Amount due to Theft', 'Start Fule Level (Ltrs)', ' EOD Fule Level (Ltrs)'];
    const data: String[][] = [];

    let i = 1;
    this.DAILY_FUEL_ELEMENT_DATA.forEach(value => {
      const row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.report_date);
      row.push(value.report_day);
      row.push(value.total_km);
      row.push(value.total_fuel_consumed);
      row.push(value.average_mileage);
      row.push(value.refills_count);
      row.push(value.refills_liters);
      row.push(value.rate_of_fuel_per_liter);
      row.push(value.total_amount_spent_on_fuel);
      row.push(value.theft_count);
      row.push(value.theft_liters);
      row.push(value.total_amount_loss_due_to_theft);
      row.push(value.start_fuel);
      row.push(value.end_fuel);
      data.push(row);
      i++;
    }),
      PdfUtils.downloadPdf(pdf_heading_date, Columns, data, 'DailyFuelReport');
  }

  customFuelReportExcel() {
    this.dailyFuelReportExcel();
  }

  customFuelReportPdf() {
    const title1 = 'Pragati UTrack Custom Fuel Report \n Report generated on ';
    const title2 = DateUtils.getDisplayDateTimeFromDate(new Date());
    const pdf_heading_date = title1.concat(title2);

    const Columns: string[] = ['ID', 'Start Date', 'End Date', 'Vehicle Number', 'Travel Distance (KM)', 'Fuel Consumed (Ltrs)', 'Mileage',
      'No of Refills ', 'Refill Fuel (Ltrs)', 'Rate of Fuel Per Ltr', 'Amount Spent on Refill',
      'No of Removals', 'Theft/Removed (Ltrs)', 'Loss Amount due to Theft'];
    const data: String[][] = [];

    let i = 1;
    this.CUSTOM_FUEL_ELEMENT_DATA_NEW.forEach(value => {
      const row: String[] = [];
      row.push(i.toString());
      row.push(value.start_date);
      row.push(value.end_date);
      row.push(value.vehicle_number);
      row.push(value.total_km);
      row.push(value.total_fuel_consumed);
      row.push(value.average_mileage);
      row.push(value.refills_count);
      row.push(value.refills_liters);
      row.push('-');
      row.push(value.total_amount_spent_on_fuel);
      row.push(value.theft_count);
      row.push(value.theft_liters);
      row.push(value.total_amount_loss_due_to_theft);
      data.push(row);
      i++;
    }),
      PdfUtils.downloadPdf(pdf_heading_date, Columns, data, 'CustomFuelReport');
  }

  fuelRefillReportExcel() {
    this.dailyFuelReportExcel();
  }

  fuelRefillReportPdf() {
    const title1 = 'Pragati UTrack Fuel Refill Report \n Report generated on ';
    const title2 = DateUtils.getDisplayDateTimeFromDate(new Date());
    const pdf_heading_date = title1.concat(title2);

    const Columns: string[] = ['ID', 'Vehicle Number', 'Refill Date Time', 'Refill Day', 'Refill Fuel (Liters)','LatLng', 'Nearest Location','Filling Station Name', 'Rate of Fuel Per Ltr', 'Amount Spent on Refill'];
    const data: String[][] = [];

    let i = 1;
    this.REFIL_FUEL_ELEMENT_DATA.forEach(value => {
      const row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.report_date);
      row.push(value.report_day);
      row.push(value.fuel_change_liters);
      row.push(value.latlng);
      row.push(value.landmark);
      row.push(value.filling_station_name);
      row.push(value.rate_of_fuel_per_liter);
      row.push(value.fuel_amount);
      data.push(row);
      i++;
    }),
      PdfUtils.downloadPdf(pdf_heading_date, Columns, data, 'FuelRefillReport');
  }

  theftRefillReportExcel() {
    const theft_columns = ['ID', 'Vehicle Number', 'Date', 'Day', 'Nearest Location', 'Theft/Remove (Ltrs)', 'Loss Of Amount Due To Theft'];
    const theft_mainTitle = 'Pragati UTrack Fuel Theft Report';
    const theft_title_dates = DateUtils.getDisplayDateTimeFromDate(new Date());

    const workbook = new Workbook();
    const theft_worksheet = workbook.addWorksheet('Thfet Fuel Report');

    const theft_myLogoImage = workbook.addImage({
      base64: Base64ImageConstants.uTrackLogoWithBG,
      extension: 'png',
    });

    const theft_ramkiLogo = workbook.addImage({
      base64: Base64ImageConstants.ramkiLogo,
      extension: 'png',
    });

    theft_worksheet.mergeCells('A1:B3');
    theft_worksheet.addImage(theft_myLogoImage, 'A1:B3');

    theft_worksheet.mergeCells('E1:F3');
    theft_worksheet.addImage(theft_ramkiLogo, 'E1:F3');

    theft_worksheet.mergeCells('C1', 'D2');

    const theft_titleRow = theft_worksheet.getCell('C1');
    theft_titleRow.value = theft_mainTitle,
      theft_titleRow.font = {
        name: 'Calibri',
        size: 18,
        underline: 'single',
        bold: true,
        color: { argb: '0085A3' },
      };
    theft_titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

    theft_worksheet.mergeCells('C3', 'D3');
    const theft_startToendData = theft_worksheet.getCell('C3');
    theft_startToendData.value = theft_title_dates;
    theft_startToendData.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' },
    };
    theft_startToendData.alignment = { vertical: 'middle', horizontal: 'center' };

    theft_worksheet.addRow([]);

    const headerRow = theft_worksheet.addRow(theft_columns);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 14,
      };
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' },
        bottom: { style: 'thin' }, right: { style: 'thin' },
      };
    });

    // Adding Data with Conditional Formatting
    let i = 1;
    this.THEFT_FUEL_ELEMENT_DATA.forEach(value => {
      const row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.report_date);
      row.push(value.report_day);
      row.push(value.landmark);
      row.push(value.fuel_change_liters);
      row.push(value.fuel_amount);
      theft_worksheet.addRow(row);
      i++;
    }),

      theft_worksheet.getColumn(1).width = 5;
    theft_worksheet.getColumn(2).width = 23;
    theft_worksheet.getColumn(3).width = 23;
    theft_worksheet.getColumn(4).width = 23;
    theft_worksheet.getColumn(5).width = 65;
    theft_worksheet.getColumn(6).width = 24;
    theft_worksheet.getColumn(7).width = 34;
    theft_worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'FuelTheftReport' + '.xlsx');
    });

  }

  theftRefillReportPdf() {
    const title1 = 'Pragati UTrack Fuel Theft Report \n Report generated on ';
    const title2 = DateUtils.getDisplayDateTimeFromDate(new Date());
    const pdf_heading_date = title1.concat(title2);

    const Columns: string[] = ['ID', 'Vehicle Number', 'Date', 'Day', 'Nearest Location', 'Theft/Remove (Ltrs)', 'Loss Of Amount Due To Theft'];
    const data: String[][] = [];

    let i = 1;
    this.THEFT_FUEL_ELEMENT_DATA.forEach(value => {
      const row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.report_date);
      row.push(value.report_day);
      row.push(value.landmark);
      row.push(value.fuel_change_liters);
      row.push(value.fuel_amount);
      data.push(row);
      i++;
    }),
      PdfUtils.downloadPdf(pdf_heading_date, Columns, data, 'FuelTheftReport');
  }

  trackHistory(report_date_formatted) {
    this.routes.navigate([`web/track_history`, this.deviceLinkId, report_date_formatted])
    { relativeTo: this.activatedRoute }
  }

  new_track_report_web_mongo_fuel_v1() {
    if (this.deviceLinkId != null && this.deviceLinkId != undefined && this.deviceLinkId != "") {
      var time_split = 150;
      this.uTrackService.new_track_report_web_mongo_fuel_v1(this.deviceLinkId,
        DateUtils.getServerDateTime(this.fuelSelectionForm.value.startDate),
        DateUtils.getServerDateTime(this.fuelSelectionForm.value.endDate), time_split).subscribe(response => {
          let fuels = [];
          let dates = [];
          this.ELEMENT_DATA = [];
          if (response.data != null && response.data != undefined && response.data.length > 0) {
            this.FuleRawDataNotshow = false;
            this.GraphDataNotshow = false;
            response.data.forEach(val => {
              this.ELEMENT_DATA.push(val);
            })

            let i = 0;
            this.ELEMENT_DATA.forEach(row => {
              try {
                dates.push((row.dt));
                fuels.push(row.fuel_avg);
              } catch (Exception) {
              }
              i++;
            })
          } else {
            this.FuleRawDataNotshow = true;
            this.GraphDataNotshow = true;
          }

          this.dataSource.data = this.ELEMENT_DATA
          this.updateChartData(dates, fuels);
        })
    } else {
      this.toasterService.danger('', 'No Devices Found.');
    }
  }

  downloadPDF() {
    const title1 = 'Utrack Fuel Report \n '
    const title3 = DateUtils.getDisplayDateTime(this.fuelSelectionForm.value.startDate) + ' To '
      + DateUtils.getDisplayDateTime(this.fuelSelectionForm.value.endDate);
    const pdf_heading_date = title1.concat(title3);
    let customerTableColumn: string[] = ['ID', 'Date Time', 'Fuel', 'Latitude', 'Longitude', 'Nearest Location'];
    let data: String[][] = [];
    let i = 1;

    for (let myData of this.ELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString())
      row.push(myData.dt);
      row.push(String(myData.fuel_avg))
      row.push(myData.la.toString())
      row.push(myData.lo.toString())
      row.push(myData.ld + ' KM From ' + myData.ln)
      data.push(row);
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_date, customerTableColumn, data, 'AllFuelDetails');
  }

  epxportexcle() {
    const columns = ['ID', 'Date & Time', 'Fuel', 'Latitude', 'Longitude', 'Nearest Location', ' '];
    const converted_date = DateUtils.getDisplayDateTime(this.fuelSelectionForm.value.startDate) + ' To '
      + DateUtils.getDisplayDateTime(this.fuelSelectionForm.value.endDate);
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
    titleRow.value = 'Utrack Fuel Report'
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
    startToendData.value = converted_date
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
    for (let myData of this.ELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString())
      row.push(myData.dt);
      row.push(String(myData.fuel_avg))
      row.push(myData.la.toString())
      row.push(myData.lo.toString())
      row.push(myData.ld + ' KM From ' + myData.ln)
      worksheet.addRow(row)
      i++;
    }
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 23;
    worksheet.getColumn(3).width = 9;
    worksheet.getColumn(4).width = 13;
    worksheet.getColumn(5).width = 13;
    worksheet.getColumn(6).width = 80;
    worksheet.getColumn(7).width = 27;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'AllFuelDetails' + '.xlsx');
    })
  }

  updateChartData(dates: string[], fuels: number[]) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;
      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.info],
        tooltip: {
          trigger: 'none',
          axisPointer: {
            type: 'cross',
          },
        },
        legend: {
          data: ['Fuel Report'],
          textStyle: {
            color: echarts.textColor,
          },
        },
        grid: {
          top: 70,
          bottom: 50,
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors.info,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
            axisPointer: {
              label: {
                formatter: params => {
                  return (
                    'Fuel  ' + params.value + (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                  );
                },
              },
            },
            data: dates,
          },
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors.success,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
            axisPointer: {
              label: {
                formatter: params => {
                  return (
                    'Fuel  ' + params.value + (params.seriesData.length ? '：' + params.seriesData[0].data : '')
                  );
                },
              },
            },
            data: dates,
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: echarts.splitLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        series: [

          {
            name: 'Fuel Chart',
            type: 'line',
            smooth: true,
            data: fuels,
          },
        ],
      };
    });
  }

  openDetails(model_data: FuelDashboardResponseData) {
    const rowData = JSON.stringify(model_data);
    const dialogReference = this.dialog.open(OpenDetailsComponent, {
      disableClose: true,
      data: { vehicle_number: rowData },
    });
    dialogReference.afterClosed().subscribe(() => {
      dialogReference.close();
    });
  }

  openFuelTheftRefillDetails(model_data: FuelRefilResponseData) {
    const rowData = JSON.stringify(model_data);
    const dialogReference = this.dialog.open(OpenDetailsComponent, {
      height: '95%',
      width: '69%',
      data: { vehicle_number: rowData },
    });
    dialogReference.afterClosed().subscribe(() => {
      dialogReference.close();
    });
  }

  openLatLang(latitude: string, longitude: string) {
    const url = 'https://www.google.com/maps?q=' + latitude + ',' + longitude + '&z=12';
    window.open(url, '_blank');
  }

}
