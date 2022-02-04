import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { MatOption } from '@angular/material/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Twenty4HoursAnalysisData } from '../../../@theme/components/Model/24HoursAnalysisResponse';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// excel import paclage
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { HomeLiteV1Data } from '../../../@theme/components/Model/HomeLiteV1Response';
import { OpenDetailsComponent } from '../../dashboard/open-details/open-details.component';
import { MatDialog } from '@angular/material/dialog';
import { NbToastrService } from '@nebular/theme';

export const MY_FORMATS = {
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};

@Component({
  selector: 'ngx-twenty4-hours-analysis',
  templateUrl: './twenty4-hours-analysis.component.html',
  styleUrls: ['./twenty4-hours-analysis.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },

  ],
})
export class Twenty4HoursAnalysisComponent implements OnInit {

  vehicles: HomeLiteV1Data[] = [];

  public startDate = new Date(new Date().getTime() - (2 * 24 * 60 * 60 * 1000));
  public endDate = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));

  ELEMENT_DATA: Twenty4HoursAnalysisData[] = [];
  dataSource = new MatTableDataSource<Twenty4HoursAnalysisData>(this.ELEMENT_DATA);

  displayedColumnsObj = [
    { "value": 'id', "show": true },
    { "value": 'vehicle number', "show": true },
    { "value": 'report date', "show": true },
    { "value": 'weekDayName', "show": true },
    { "value": 'total distance', "show": true },
    { "value": 'total day distance', "show": true },
    { "value": 'total night distance', "show": true },
    { "value": 'free wheeling distance', "show": true },
    { "value": 'driver name', "show": true },
    { "value": 'driver number', "show": true },
    { "value": 'total travelled time', "show": true },
    { "value": 'total stopped time', "show": true },
    { "value": 'free wheeling time', "show": true },
    { "value": 'max speed', "show": true },
    { "value": 'avg speed', "show": true },
    { "value": 'sudden accerlation', "show": true },
    { "value": 'sudden deceleration', "show": true },
    { "value": 'utilization', "show": true },
  ]

  get displayedColumns(): string[] {
    return this.displayedColumnsObj.filter((element) => { return element.show == true }).map((element) => { return element.value });
  }

  toggle(column: string) {
    let index = this.displayedColumnsObj.map(element => element.value).indexOf(column);
    if (index >= 0) {
      this.displayedColumnsObj[index].show = !this.displayedColumnsObj[index].show;
    }
  }

  changedStartDate = new Date();
  endMaxDate = new Date();

  TableDataNotshow: boolean;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public deviceLinkId: any;
  public todayDate = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
  @ViewChild('allSelected') private allSelected: MatOption;

  constructor(
    private location: Location,
    private headerService: HeaderInteractorService,
    private uTrackService: UtrackService,
    private dialog: MatDialog,
    private toasterService: NbToastrService,
  ) {

  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.24 Hours Analysis Report');
    this.dataSource.sort = this.sort;
    this.getVehicles();
  }

  AnalysisForm = new FormGroup({
    vechicleName: new FormControl([0]),
    startDate: new FormControl(this.startDate),
    endDate: new FormControl(this.endDate),
  });

  onDateChange(event) {
    this.changedStartDate = new Date(event.value);
    this.endDate = new Date(this.changedStartDate.getTime() + (1000 * 60 * 60 * 24));
    if (this.endDate > new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000))) {
      this.endDate = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
    }
    this.endMaxDate = new Date(this.changedStartDate.getTime() + (1000 * 60 * 60 * 24 * 31));
    if (this.endMaxDate > new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000))) {
      this.endMaxDate = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
    }
  }

  analysis_report() {
    this.uTrackService.analysis_report(
      this.AnalysisForm.value.vechicleName,
      DateUtils.getServerDate(this.AnalysisForm.value.startDate),
      DateUtils.getServerDate(this.AnalysisForm.value.endDate)).subscribe(response => {
        this.ELEMENT_DATA = [];
        if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
          this.TableDataNotshow = false;
          this.ELEMENT_DATA = response.data;
        } else {
          this.TableDataNotshow = true;
        }
        this.dataSource.data = this.ELEMENT_DATA;
      });
  }

  getVehicles() {
    this.uTrackService.home_lite_v1().subscribe(response => {
      if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
        this.TableDataNotshow = false;
        this.vehicles = response.data;
        this.toggleAllSelection();
        this.analysis_report();
      } else {
        this.TableDataNotshow = true;
      }
    });
  }

  openDetails(model_data: Twenty4HoursAnalysisData) {
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

  viewReport() {
    const start_date = DateUtils.getServerDateTime(this.AnalysisForm.value.startDate);
    const end_date = DateUtils.getServerDateTime(this.AnalysisForm.value.endDate);

    const start_milli_sec = DateUtils.getDateDifference(this.AnalysisForm.value.startDate);
    const end_milli_sec = DateUtils.getDateDifference(this.AnalysisForm.value.endDate);

    if (start_date > end_date) {
      this.toasterService.danger('Pragati Utrack', 'Start date should be less than End date.');
    } else if ((end_milli_sec - start_milli_sec) > 3888000000) {
      this.toasterService.danger('Pragati Utrack', 'Difference between start and end date should be less than 45 days.');
    } else {
      this.analysis_report();
    }
  }

  downloadPDF() {
    const title1 = 'UTrack 24 Hours Analysis Report  \n';
    const title3 = 'Report Date ' + DateUtils.getDisplayDate(this.AnalysisForm.value.startDate) + ' To '
      + DateUtils.getDisplayDate(this.AnalysisForm.value.endDate);
    const pdf_heading_date = title1.concat(title3);
    const Columns: string[] = ['ID', 'Vehicle Number', 'Report Date', 'Day', 'Total Distance (KM)',
    'Total Day Distance (KM)', 'Total Night Distance (KM)','Free Wheeling KM', 'Driver Name', 'Driver Number','Total Travel Time (HH:MM:SS)',
    'Total Stopped Time (HH:MM:SS)',' Free Wheeling Time (HH:MM:SS)', 'Max Speed (KMPH)', 'Avg Speed (KMPH)',
      'Sudden Accerlation', 'Sudden Deceleration', 'Utilization'];
    const data: String[][] = [];

    let i = 1;
    for (const value of this.ELEMENT_DATA) {
      const row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.report_date);
      row.push(value.report_day);
      row.push(value.total_distance);
      row.push(value.total_day_distance);
      row.push(value.total_night_distance);
      row.push(value.free_wheeling_distance);
      row.push(value.driver_name);
      row.push(value.driver_number);
      row.push(value.total_travelled_time);
      row.push(value.total_stopped_time);
      row.push(value.free_wheeling_time);
      row.push(value.max_speed);
      row.push(value.avg_speed);
      row.push(value.sudden_accerlation);
      row.push(value.sudden_deceleration);
      row.push(value.utilization);
      data.push(row);
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_date, Columns, data, '24HoursAnalysisReport');
  }

  epxportexcle() {
    const columns = ['ID', 'Vehicle Number', 'Report Date', 'Day', 'Total Distance (KM)',
    'Total Day Distance (KM)', 'Total Night Distance (KM)','Free Wheeling KM','Driver Name', 'Driver Number', 'Total Travel Time (HH:MM:SS)',
      'Total Stopped Time (HH:MM:SS)',' Free Wheeling Time (HH:MM:SS)', 'Max Speed (KMPH)', 'Avg Speed (KMPH)',
      'Sudden Accerlation', 'Sudden Deceleration', 'Utilization'];
    const converted_date = 'Report Date ' + DateUtils.getDisplayDate(this.AnalysisForm.value.startDate) + ' To '
      + DateUtils.getDisplayDate(this.AnalysisForm.value.endDate);
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Utrack');
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

    worksheet.mergeCells('C1', 'F2');
    const titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack 24 Hours Analysis Report';
    titleRow.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' },
    };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('C3', 'F3');
    const startToendData = worksheet.getCell('C3');
    startToendData.value = converted_date;
    startToendData.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' },
    };
    startToendData.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow([]);
    const headerRow = worksheet.addRow(columns);
    headerRow.eachCell((cell, index) => {
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
        top: { style: 'thin' }, left: { style: 'thin' }
        , bottom: { style: 'thin' }, right: { style: 'thin' },
      };
    });
    // Adding Data with Conditional Formatting
    let i = 1;
    for (const value of this.ELEMENT_DATA) {
      const row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.report_date);
      row.push(value.report_day);
      row.push(value.total_distance);
      row.push(value.total_day_distance);
      row.push(value.total_night_distance);
      row.push(value.free_wheeling_distance);
      row.push(value.driver_name);
      row.push(value.driver_number);
      row.push(value.total_travelled_time);
      row.push(value.total_stopped_time);
      row.push(value.free_wheeling_time);
      row.push(value.max_speed);
      row.push(value.avg_speed);
      row.push(value.sudden_accerlation);
      row.push(value.sudden_deceleration);
      row.push(value.utilization);
      worksheet.addRow(row);
      i++;
    }
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 21;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 25;
    worksheet.getColumn(6).width = 29;
    worksheet.getColumn(7).width = 30;
    worksheet.getColumn(8).width = 23;
    worksheet.getColumn(9).width = 35;
    worksheet.getColumn(10).width = 35;
    worksheet.getColumn(11).width = 38;
    worksheet.getColumn(12).width = 33;
    worksheet.getColumn(13).width = 35;
    worksheet.getColumn(14).width = 33;
    worksheet.getColumn(15).width = 35;
    worksheet.getColumn(16).width = 23;
    worksheet.getColumn(17).width = 25;
    worksheet.getColumn(18).width = 13;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, '24HoursAnalysisReport' + '.xlsx');
    });
  }

  refresh() {
    this.analysis_report();
  }

  toggleAllSelection() {
    if (this.allSelected.selected) {
      this.AnalysisForm.controls.vechicleName
        .patchValue([...this.vehicles.map(item => item.device_link_id), 0]);
    } else {
      this.AnalysisForm.controls.vechicleName.patchValue([]);
    }
  }
}
