import { Component,OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { HomeLiteV1Data } from '../../../@theme/components/Model/HomeLiteV1Response';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { Location } from '@angular/common';
//excel import paclage
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
// drop down search 
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { MatTableDataSource } from '@angular/material/table';
import { NbToastrService } from '@nebular/theme';
import { OverSpeedReportResponesData1 } from '../../../@theme/components/Model/OverSpeedReport';

@Component({
  selector: 'ngx-over-speed-report',
  templateUrl: './over-speed-report.component.html',
  styleUrls: ['./over-speed-report.component.scss']
})
export class OverSpeedReportComponent implements OnInit {

  private vehicles: HomeLiteV1Data[] = [];
  public deviceLinkId: string;

  selectTimeInterval: number;
  overSpeedReportTableDataNotshow: boolean;

  startDate = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
  endDate = new Date();
  currentDate = new Date();
  minStartDate = new Date(new Date().getTime() - (365 * 24 * 60 * 60 * 1000));

  mainData: OverSpeedReportResponesData1[] = []
  overSpeedReportDisplayedColumns: string[] = ['id', 'from_date_time', 'to_date_time', 'max_speed', 'avg_speed','durations', 'total_distance', 'location'];
  overSpeedReportdataSource = new MatTableDataSource<OverSpeedReportResponesData1>(this.mainData);

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  vehicle_type: string;
  vehicle_number: string;
  selectedRow: HomeLiteV1Data;

  constructor(
    private headerService: HeaderInteractorService,
    private uTrackService: UtrackService,
    private location: Location,
    private toasterService: NbToastrService,
  ) { }

  private _onDestroy = new Subject<void>();

  ngOnInit(): void {
    this.selectTimeInterval = 30;
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Over speed report');
    this.getVehicles();
    this.searchvehiclenumber.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterVehicles();
    });
  }

  overSpeedReportForm = new FormGroup({
    vechicleName: new FormControl(''),
    speedLimit: new FormControl(''),
    startDate: new FormControl(this.startDate),
    endDate: new FormControl(this.endDate)
  })

  public searchvehiclenumber: FormControl = new FormControl();
  public filteredVehicleNumber: ReplaySubject<HomeLiteV1Data[]> = new ReplaySubject<HomeLiteV1Data[]>(1);

  @ViewChild('singleSelect', { static: false }) singleSelect: MatSelect;

  private filterVehicles() {
    if (!this.vehicles) {
      return;
    }
    let search = this.searchvehiclenumber.value;
    if (!search) {
      this.filteredVehicleNumber.next(this.vehicles);
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredVehicleNumber.next(
      this.vehicles.filter(searchData => searchData.vehicle_number.toLowerCase().indexOf(search) > -1)
    );
  }

  getVehicles() {
    this.uTrackService.home_lite_v1().subscribe(response => {
      this.vehicles = [];
      if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
        this.overSpeedReportTableDataNotshow = false;
        this.vehicles = response.data;
        this.filteredVehicleNumber.next(this.vehicles);
        this.deviceLinkId = this.vehicles[0].device_link_id;
        this.vehicle_number = this.vehicles[0].vehicle_number;
        this.vehicle_type = this.vehicles[0].vehicle_type;
        this.final_summary_report_mongo_over_speed();
      } else {
        this.overSpeedReportTableDataNotshow = true;
      }
    })
  }

  back() {
    this.location.back();
  }

  updateSelectedValue(row) {
    this.selectedRow = row;
    this.vehicle_number = this.selectedRow.vehicle_number;
    this.vehicle_type = this.selectedRow.vehicle_type;
    this.deviceLinkId = this.selectedRow.device_link_id;
    this.viewReport();
  }

  viewReport() {
    const start_date = DateUtils.getServerDateTime(this.overSpeedReportForm.value.startDate);
    const end_date = DateUtils.getServerDateTime(this.overSpeedReportForm.value.endDate);
    const start_milli_sec = DateUtils.getDateDifference(this.overSpeedReportForm.value.startDate);
    const end_milli_sec = DateUtils.getDateDifference(this.overSpeedReportForm.value.endDate);
    if (start_date > end_date) {
      this.toasterService.danger('', 'Start date should be less than End date.');
    } else if ((end_milli_sec - start_milli_sec) > 3888000000) {
      this.toasterService.danger('', 'Difference between start and end date should be less than 45 days');
    } else {
      this.final_summary_report_mongo_over_speed();
    }
  }

  final_summary_report_mongo_over_speed() {
    this.uTrackService.final_summary_report_mongo_over_speed(this.deviceLinkId,
      DateUtils.getServerDateTimeFromDate(this.overSpeedReportForm.value.startDate),
      DateUtils.getServerDateTimeFromDate(this.overSpeedReportForm.value.endDate),
      this.overSpeedReportForm.value.speedLimit).subscribe(response => {
        this.mainData = [];
        if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
          this.overSpeedReportTableDataNotshow = false;
          this.mainData = response.data;
        } else {
          this.overSpeedReportTableDataNotshow = true;
        }
        this.overSpeedReportdataSource.data = this.mainData;
      })
  }

  downloadPDF() {
    const title1 = 'UTrack Over Speed Report \n ';
    const title2 = this.vehicle_number + '(' + this.vehicle_type + ')' + '\n';
    const title3 = DateUtils.getDisplayDateTime(this.overSpeedReportForm.value.startDate) + ' To '
      + DateUtils.getDisplayDateTime(this.overSpeedReportForm.value.endDate);
    const pdf_heading_date = title1.concat(title2).concat(title3);

    let columns: string[] = ['ID', 'From Date Time', 'To Date Time', 'Max Speed (KMPH)', 'Avg Speed (KMPH)','Duration (HH:MM:SS)','Total Distance (KM)', 'Nearest Location'];
    let data: String[][] = [];
    let i = 1;
    for (let mydata of this.mainData) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(mydata.fdt);
      row.push(mydata.tdt);
      row.push(mydata.ms);
      row.push(mydata.as);
      row.push(mydata.d);
      row.push(mydata.td);
      row.push(mydata.l);
      data.push(row)
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_date, columns, data, 'OverSpeedReport');
  }

  epxportexcle() {
    let DistanceReportcolumns = ['ID', 'From Date Time', 'To Date Time', 'Max Speed (KMPH)', 'Avg Speed (KMPH)','Duration (HH:MM:SS)','Total Distance (KM)', 'Nearest Location'];
    const converted_date = DateUtils.getDisplayDateTime(this.overSpeedReportForm.value.startDate) + ' To '
      + DateUtils.getDisplayDateTime(this.overSpeedReportForm.value.endDate);

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

    worksheet.mergeCells('F1:F3');
    worksheet.addImage(ramkiLogo, 'F1:F3');
    //Add Row and formatting
    worksheet.mergeCells('C1', 'E2');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack Over Speed Report' + ' - ' + this.vehicle_number + ' ( ' + this.vehicle_type + ' )'
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
    let headerRow = worksheet.addRow(DistanceReportcolumns);
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
    for (let mydata of this.mainData) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(mydata.fdt);
      row.push(mydata.tdt);
      row.push(mydata.ms);
      row.push(mydata.as);
      row.push(mydata.d);
      row.push(mydata.td);
      row.push(mydata.l);
      worksheet.addRow(row)
      i++;
    }
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 22;
    worksheet.getColumn(3).width = 35;
    worksheet.getColumn(4).width = 28;
    worksheet.getColumn(5).width = 28;
    worksheet.getColumn(6).width = 28;
    worksheet.getColumn(7).width = 30;
    worksheet.getColumn(8).width = 80;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'OverSpeedReport' + '.xlsx');
    })
  }

}
