import { Component, OnInit, ViewChild } from '@angular/core';
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
import { AllPositionsReportResponse } from '../../../@theme/components/Model/AllPositionsReport';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-all-positions-report',
  templateUrl: './all-positions-report.component.html',
  styleUrls: ['./all-positions-report.component.scss']
})
export class AllPositionsReportComponent implements OnInit {
  private vehicles: HomeLiteV1Data[] = []
  public deviceLinkId: string;

  selectTimeInterval: number;

  allPositionsTableDataNotshow: boolean;

  startDate = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
  endDate = new Date();
  currentDate = new Date();
  minStartDate = new Date(new Date().getTime() - (365 * 24 * 60 * 60 * 1000));

  mainData: AllPositionsReportResponse[] = []
  allPositionsDisplayedColumns: string[] = ['id', 'date', 'time', 'latitude', 'longitude', 'speed', 'distance', 'location'];
  allpositionsReportdataSource = new MatTableDataSource<AllPositionsReportResponse>(this.mainData);

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
    this.selectTimeInterval = 120;
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.All Positions Report');
    this.getVehicles();
    this.searchvehiclenumber.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterVehicles();
    });
  }

  allPositonsReportForm = new FormGroup({
    vechicleName: new FormControl(''),
    vehicleTimeInterval: new FormControl(''),
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
        this.allPositionsTableDataNotshow = false;
        this.vehicles = response.data;
        this.filteredVehicleNumber.next(this.vehicles);
        this.deviceLinkId = this.vehicles[0].device_link_id;
        this.vehicle_number = this.vehicles[0].vehicle_number;
        this.vehicle_type = this.vehicles[0].vehicle_type;
        this.new_track_report_web_mongo_raw_report();
      } else {
        this.allPositionsTableDataNotshow = true;
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
    const start_date = DateUtils.getServerDateTime(this.allPositonsReportForm.value.startDate);
    const end_date = DateUtils.getServerDateTime(this.allPositonsReportForm.value.endDate);
    const start_milli_sec = DateUtils.getDateDifference(this.allPositonsReportForm.value.startDate);
    const end_milli_sec = DateUtils.getDateDifference(this.allPositonsReportForm.value.endDate);
    if (start_date > end_date) {
      this.toasterService.danger('', 'Start date should be less than End date.');
    } else if ((end_milli_sec - start_milli_sec) > 3888000000) {
      this.toasterService.danger('', 'Difference between start and end date should be less than 45 days ');
    } else {

      this.new_track_report_web_mongo_raw_report();

    }
  }


  dateChange(){
    const start_date = DateUtils.getServerDateTime(this.allPositonsReportForm.value.startDate);
    const end_date = DateUtils.getServerDateTime(this.allPositonsReportForm.value.endDate);
    const start_milli_sec = DateUtils.getDateDifference(this.allPositonsReportForm.value.startDate);
    const end_milli_sec = DateUtils.getDateDifference(this.allPositonsReportForm.value.endDate);
    if (start_date > end_date) {
      this.toasterService.danger('', 'Start date should be less than End date.');
    } else if ((end_milli_sec - start_milli_sec) > 3888000000) {
      this.toasterService.danger('', 'Difference between start and end date should be less than 45 days ');
    } else {

      const startAndendDateTimeDiff = end_milli_sec - start_milli_sec;

      if(startAndendDateTimeDiff <= 172799999){
        this.selectTimeInterval = 30 // 1days
      }else if(startAndendDateTimeDiff <= 431999999){
        this.selectTimeInterval = 60 // 2days
      }else if(startAndendDateTimeDiff <= 604799999){
        this.selectTimeInterval = 300 // 5days
      }else if( startAndendDateTimeDiff <= 1209599999){
        this.selectTimeInterval = 600 // 1week
      }else if(startAndendDateTimeDiff >= 1209599999){
        this.selectTimeInterval = 900 // 2week
      }
    }
  }

  new_track_report_web_mongo_raw_report() {
    this.uTrackService.new_track_report_web_mongo_raw_report(this.deviceLinkId,
      DateUtils.getServerDateTimeFromDate(this.allPositonsReportForm.value.startDate),
      DateUtils.getServerDateTimeFromDate(this.allPositonsReportForm.value.endDate),
      this.selectTimeInterval).subscribe(response => {
        this.mainData = [];
        if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
          this.allPositionsTableDataNotshow = false;
          this.mainData = response.data;
        } else {
          this.allPositionsTableDataNotshow = true;
        }
        this.allpositionsReportdataSource.data = this.mainData;
      })
  }

  downloadPDF() {
    const title1 = 'UTrack All Positions Report \n ';
    const title2 = this.vehicle_number + '(' + this.vehicle_type + ')' + '\n';
    const title3 = DateUtils.getDisplayDateTime(this.allPositonsReportForm.value.startDate) + ' To '
      + DateUtils.getDisplayDateTime(this.allPositonsReportForm.value.endDate);
    const pdf_heading_date = title1.concat(title2).concat(title3);

    let columns: string[] = ['ID', 'Date', 'Time', 'Latitude', 'Longitude', 'Speed (KMPH)', 'Distance (KM)', 'Nearest Location'];
    let data: String[][] = [];
    let i = 1;
    for (let mydata of this.mainData) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(mydata.d);
      row.push(mydata.t);
      row.push(mydata.la.toString());
      row.push(mydata.lo.toString());
      row.push(mydata.s.toString());
      row.push(mydata.cd);
      row.push(mydata.l);
      data.push(row)
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_date, columns, data, 'AllPositionsReport');
  }

  epxportexcle() {
    let DistanceReportcolumns = ['ID', 'Date', 'Time', 'Latitude', 'Longitude', 'Speed (KMPH)', 'Distance (KM)', 'Nearest Location'];
    const converted_date = DateUtils.getDisplayDateTime(this.allPositonsReportForm.value.startDate) + ' To '
      + DateUtils.getDisplayDateTime(this.allPositonsReportForm.value.endDate);
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
    titleRow.value = 'UTrack All Positions Report' + ' - ' + this.vehicle_number + ' ( ' + this.vehicle_type + ' )'
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
      row.push(mydata.d);
      row.push(mydata.t);
      row.push(mydata.la.toString());
      row.push(mydata.lo.toString());
      row.push(mydata.s.toString());
      row.push(mydata.cd);
      row.push(mydata.l);
      worksheet.addRow(row)
      i++;
    }
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 22;
    worksheet.getColumn(3).width = 35;
    worksheet.getColumn(4).width = 28;
    worksheet.getColumn(5).width = 28;
    worksheet.getColumn(6).width = 30;
    worksheet.getColumn(7).width = 20;
    worksheet.getColumn(8).width = 80;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'AllPositionsReport' + '.xlsx');
    })
  }
}
