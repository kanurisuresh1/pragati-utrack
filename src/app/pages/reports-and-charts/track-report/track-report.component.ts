import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import 'jspdf-autotable';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
//excel import paclage
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
// drop down search 
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { HomeLiteV1Data } from '../../../@theme/components/Model/HomeLiteV1Response';
import { NbToastrService } from '@nebular/theme';
import { stoppageTrackReportResponseData } from '../../../@theme/components/Model/StoppageTrackReportResponse';

@Component({
  selector: 'ngx-track-report',
  templateUrl: './track-report.component.html',
  styleUrls: ['./track-report.component.scss']
})
export class TrackReportComponent implements OnInit {

  TrackReportTableDataNotshow: boolean;

  private vehicles: HomeLiteV1Data[] = [];

  deviceLinkId: string;

  startDate = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
  endDate = new Date();
  minStartDate = new Date(new Date().getTime() - (365 * 24 * 60 * 60 * 1000));
  currentDate = new Date();

  selectTimeInterval: number;

  mainData: stoppageTrackReportResponseData[] = [];
  originalData: stoppageTrackReportResponseData[] = [];
  originalTempData: stoppageTrackReportResponseData[] = [];
  stoppageDisplayedColumns: string[] = ['id', 'from_date', 'to_date', 'type', 'duration', 'distance', 'latitude', 'longitude', 'landmark',];
  stoppageReportdataSource = new MatTableDataSource<stoppageTrackReportResponseData>(this.mainData);

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dashboard_device_link_id: string;

  selectedRow: HomeLiteV1Data;

  vehicle_number: string;
  vehicle_type: string;

  constructor(private location: Location,
    private headerService: HeaderInteractorService,
    private uTrackService: UtrackService,
    private activatedRoute: ActivatedRoute,
    private toasterService: NbToastrService,

  ) {
    this.activatedRoute.params.subscribe(params => {
      this.dashboard_device_link_id = params.device_link_id;
    });
  }

  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Track Report');
    this.getVehicles();
    this.selectTimeInterval = 60;
    this.searchvehiclenumber.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterVehicles();
    });
  }

  trackReportForm = new FormGroup({
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
      if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
        this.TrackReportTableDataNotshow = false;
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
        this.new_track_report_web_mongo();
      } else {
        this.TrackReportTableDataNotshow = true;
      }
    })
  }

  new_track_report_web_mongo() {
    this.uTrackService.stoppage_track_report(this.deviceLinkId,
      DateUtils.getServerDateTimeFromDate(this.trackReportForm.value.startDate),
      DateUtils.getServerDateTimeFromDate(this.trackReportForm.value.endDate), '0').subscribe(response => {
        this.mainData = [];
        if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
          this.TrackReportTableDataNotshow = false;
          this.originalData = response.data;
          this.fillterData();
        } else {
          this.TrackReportTableDataNotshow = true;
        }
        this.stoppageReportdataSource.data = this.mainData;
      })
  }

  fillterData() {
    let timeSeconds: number = this.trackReportForm.value.vehicleTimeInterval;
    this.mainData = [];
    this.originalTempData = [];
    this.originalData.forEach(element => {
      if ('Stopped' === element.type) {
        if (element.ttts > timeSeconds) {
          this.originalTempData.push(element);
        }
      } else {
        this.originalTempData.push(element);
      }
    });
    if (this.originalTempData.length > 0) {
      let i = 0;
      this.originalTempData.forEach(element => {
        if ('Stopped' === element.type) {
          this.mainData.push(element);
        } else {
          if (i == 0) {
            this.mainData.push(element);
          } else if ('Stopped' === this.originalTempData[i - 1].type) {
            this.mainData.push(element);
          } else {
            let total_distance = Number(this.originalTempData[i - 1].ttd) + Number(element.ttd);
            this.originalTempData[i - 1].ttd = total_distance.toFixed(2);
            this.originalTempData[i - 1].tdt = element.tdt;
            let time = this.originalTempData[i - 1].ttts + element.ttts;
            this.originalTempData[i - 1].ttts = time;
            this.originalTempData[i - 1].ttt = DateUtils.secondsToFormattedTime(time);
          }
        }
        i = i + 1;
      });
    }
    this.stoppageReportdataSource.data = this.mainData;
    if (this.mainData.length > 0) {
      this.TrackReportTableDataNotshow = false;
    } else {
      this.TrackReportTableDataNotshow = true;
    }
  }

  back() {
    this.location.back();
  }

  timeselectChanged() {
    if (this.originalData.length > 0) {
      this.fillterData();
    } else {
      this.TrackReportTableDataNotshow = true;
    }
  }

  refresh() {
    this.new_track_report_web_mongo()
  }

  updateSelectedValue(row) {
    this.selectedRow = row;
    this.vehicle_number = this.selectedRow.vehicle_number;
    this.vehicle_type = this.selectedRow.vehicle_type;
    this.trackReportForm.value.vechicleName = this.selectedRow.device_link_id;
    this.viewReport();
  }

  downloadPDF() {
    const title1 = 'UTrack Track Data \n ';
    const title2 = this.vehicle_number + '(' + this.vehicle_type + ')' + '\n';
    const title3 = DateUtils.getDisplayDateTime(this.trackReportForm.value.startDate) + ' To '
      + DateUtils.getDisplayDateTime(this.trackReportForm.value.endDate);
    const pdf_heading_date = title1.concat(title2).concat(title3);
    let columns: string[] = ['ID', 'From Date Time', 'To Date Time', 'Type', 'Duration (HH:MM:SS)', 'Distance (KM)', 'Latitude', 'Longitude', 'Nearest Location',];
    let data: String[][] = [];
    let i = 1;

    for (let mydata of this.mainData) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(mydata.fdt);
      row.push(mydata.tdt);
      row.push(mydata.type);
      row.push(mydata.ttt);
      row.push(mydata.ttd);
      row.push(mydata.la);
      row.push(mydata.lo);
      row.push(mydata.l);
      data.push(row);
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_date, columns, data, 'TrackReport');
  }

  epxportexcle() {
    let TrackReportcolumns = ['ID', 'From Date Time', 'To Date Time', 'Type', 'Duration (HH:MM:SS)', 'Distance (KM)', 'Latitude', 'Longitude', 'Nearest Location', ''];
    const conver_date = DateUtils.getDisplayDateTime(this.trackReportForm.value.startDate) + ' To '
      + DateUtils.getDisplayDateTime(this.trackReportForm.value.endDate);
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
    titleRow.value = 'UTrack Track Report' + ' - ' + this.vehicle_number + ' ( ' + this.vehicle_type + ' )'
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
    startToendData.value = conver_date
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
    let headerRow = worksheet.addRow(TrackReportcolumns);
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
      row.push(mydata.ttd);
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
      fs.saveAs(blob, 'TrackReport' + '.xlsx');
    })
  }

  viewReport() {
    const start_date = DateUtils.getServerDateTime(this.trackReportForm.value.startDate);
    const end_date = DateUtils.getServerDateTime(this.trackReportForm.value.endDate);

    const start_milli_sec = DateUtils.getDateDifference(this.trackReportForm.value.startDate);
    const end_milli_sec = DateUtils.getDateDifference(this.trackReportForm.value.endDate);

    if (start_date > end_date) {
      this.toasterService.danger('Pragati Utrack', 'Start date should be less than End date.');
    } else if ((end_milli_sec - start_milli_sec) > 3888000000) {
      this.toasterService.danger('Pragati Utrack', 'Difference between start and end date should be less than 45 days.');
    } else {
      this.new_track_report_web_mongo();
    }
  }
}
