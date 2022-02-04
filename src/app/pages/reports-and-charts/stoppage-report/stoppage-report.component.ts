import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
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
import { HomeLiteV1Data } from '../../../@theme/components/Model/HomeLiteV1Response';
import { NbToastrService } from '@nebular/theme';
import { stoppageTrackReportResponseData } from '../../../@theme/components/Model/StoppageTrackReportResponse';

@Component({
  selector: 'ngx-stoppage-report',
  templateUrl: './stoppage-report.component.html',
  styleUrls: ['./stoppage-report.component.scss']
})
export class StoppageReportComponent implements OnInit {

  private vehicles: HomeLiteV1Data[] = [];
  public deviceLinkId: string;

  selectTimeInterval: number;

  startDate = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
  endDate = new Date();
  minStartDate = new Date(new Date().getTime() - (365 * 24 * 60 * 60 * 1000));
  currentDate = new Date();

  mainData: stoppageTrackReportResponseData[] = [];
  originalData: stoppageTrackReportResponseData[] = [];
  stoppageDisplayedColumns: string[] = ['id', 'from_date', 'to_date', 'type', 'duration', 'latitude', 'longitude', 'landmark',];
  stoppageReportdataSource = new MatTableDataSource<stoppageTrackReportResponseData>(this.mainData);

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private dashboard_device_link_id: string;
  vehicle_type: string;
  vehicle_number: string;
  selectedRow: HomeLiteV1Data;

  StoppageTableDataNotshow: boolean;

  private columns: string[];

  constructor(
    private location: Location,
    private headerService: HeaderInteractorService,
    private uTrackService: UtrackService,
    private activatedRoute: ActivatedRoute,
    private toasterService: NbToastrService,
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.dashboard_device_link_id = params.device_link_id;
    });
  }

  private _onDestroy = new Subject<void>();

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Stoppage Report')
    this.getVehicles();
    this.selectTimeInterval = 60;
    this.searchvehiclenumber.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterVehicles();
    });
  }

  stoppageReportForm = new FormGroup({
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
      if (response.data != null && response.data != undefined && response.data.length > 0) {
        this.StoppageTableDataNotshow = false;
        this.vehicles = response.data;
        this.filteredVehicleNumber.next(this.vehicles);
        if (this.dashboard_device_link_id == undefined || this.dashboard_device_link_id == null || this.dashboard_device_link_id == "") {
          this.deviceLinkId = this.vehicles[0].device_link_id;
          this.vehicle_number = this.vehicles[0].vehicle_number;
          this.vehicle_type = this.vehicles[0].vehicle_type;
        } else {
          this.vehicles.forEach(element => {
            if (this.dashboard_device_link_id == element.device_link_id) {
              this.deviceLinkId = this.dashboard_device_link_id;
            }
          })
        }
        this.stoppage_track_report();
      } else {
        this.StoppageTableDataNotshow = true;
      }
    })
  }

  stoppage_track_report() {
    this.uTrackService.stoppage_track_report(this.deviceLinkId,
      DateUtils.getServerDateTimeFromDate(this.stoppageReportForm.value.startDate),
      DateUtils.getServerDateTimeFromDate(this.stoppageReportForm.value.endDate), '1').subscribe(response => {
        this.mainData = [];
        this.originalData = [];
        if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
          this.StoppageTableDataNotshow = false;
          this.originalData = response.data;
          this.fillterData();
        } else {
          this.StoppageTableDataNotshow = true;
        }
      })
  }

  fillterData() {
    let timeSeconds: number = this.stoppageReportForm.value.vehicleTimeInterval;
    this.mainData = [];
    this.originalData.forEach(element => {
      if (element.ttts > timeSeconds) {
        this.mainData.push(element);
      }
    });
    this.stoppageReportdataSource.data = this.mainData;
    if (this.mainData.length > 0) {
      this.StoppageTableDataNotshow = false;
    } else {
      this.StoppageTableDataNotshow = true;
    }
  }

  back() {
    this.location.back();
  }

  timeselectChanged() {
    if (this.originalData.length > 0) {
      this.fillterData();
    } else {
      this.StoppageTableDataNotshow = true;
    }
  }


  updateSelectedValue(row) {
    this.selectedRow = row;
    this.vehicle_number = this.selectedRow.vehicle_number;
    this.vehicle_type = this.selectedRow.vehicle_type;
    this.stoppageReportForm.value.vechicleName = this.selectedRow.device_link_id;
    this.viewReport();
  }

  downloadPDF() {
    const title1 = 'UTrack Stoppage Report \n ';
    const title2 = this.vehicle_number + '(' + this.vehicle_type + ')' + '\n';
    const title3 = DateUtils.getDisplayDateTime(this.stoppageReportForm.value.startDate) + ' To '
      + DateUtils.getDisplayDateTime(this.stoppageReportForm.value.endDate);
    const pdf_heading_date = title1.concat(title2).concat(title3);

    let columns: string[] = ['ID', 'From Date Time', 'To Date Time', 'Type', 'Duration (HH:MM:SS)', 'Latitude', 'Longitude', 'Nearest Location',];
    let data: String[][] = [];

    let i = 1;
    for (let mydata of this.mainData) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(mydata.fdt);
      row.push(mydata.tdt);
      row.push(mydata.type);
      row.push(mydata.ttt);
      row.push(mydata.la);
      row.push(mydata.lo);
      row.push(mydata.l);
      data.push(row);
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_date, columns, data, 'StoppageReport');
  }

  epxportexcle() {
    this.columns = ['ID', 'From Date Time', 'To Date Time', 'Type', 'Duration (HH:MM:SS)', 'Latitude', 'Longitude', 'Nearest Location', '']
    const converted_date = DateUtils.getDisplayDateTime(this.stoppageReportForm.value.startDate) + ' To '
      + DateUtils.getDisplayDateTime(this.stoppageReportForm.value.endDate);
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

    worksheet.mergeCells('H1:H3');
    worksheet.addImage(ramkiLogo, 'H1:H3');
    //Add Row and formatting
    worksheet.mergeCells('C1', 'G2');

    let titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack Stoppage Report' + ' - ' + this.vehicle_number + ' ( ' + this.vehicle_type + ' )'
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
    let headerRow = worksheet.addRow(this.columns);
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
      row.push(mydata.type);
      row.push(mydata.ttt);
      row.push(mydata.la);
      row.push(mydata.lo);
      row.push(mydata.l);
      worksheet.addRow(row);
      i++;
    }

    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 22;
    worksheet.getColumn(3).width = 22;
    worksheet.getColumn(4).width = 9;
    worksheet.getColumn(5).width = 26;
    worksheet.getColumn(6).width = 19;
    worksheet.getColumn(7).width = 19;
    worksheet.getColumn(8).width = 19;
    worksheet.getColumn(9).width = 80;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'UTrack_Stoppage_Report' + '.xlsx');
    })
  }

  viewReport() {
    const start_date = DateUtils.getServerDateTime(this.stoppageReportForm.value.startDate);
    const end_date = DateUtils.getServerDateTime(this.stoppageReportForm.value.endDate);
    const start_milli_sec = DateUtils.getDateDifference(this.stoppageReportForm.value.startDate);
    const end_milli_sec = DateUtils.getDateDifference(this.stoppageReportForm.value.endDate);

    if (start_date > end_date) {
      this.toasterService.danger('', 'Start date should be less than End date.');
    } else if ((end_milli_sec - start_milli_sec) > 3888000000) {
      this.toasterService.danger('', 'Difference between start and end date should be less than 45 days.');
    } else {
      this.stoppage_track_report();
    }
  }
}
