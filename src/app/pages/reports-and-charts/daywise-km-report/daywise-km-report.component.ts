import { Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { Location } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import * as _moment from 'moment';
import { Detail } from '../../../@theme/components/Model/DayWiseKmResponse';
// excel import paclage
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
// drop down search
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeLiteV1Data } from '../../../@theme/components/Model/HomeLiteV1Response';
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
  selector: 'ngx-daywise-km-report',
  templateUrl: './daywise-km-report.component.html',
  styleUrls: ['./daywise-km-report.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DaywiseKmReportComponent implements OnInit {

  public deviceLinkId: string;

  ELEMENT_DATA: Detail[] = [];
  displayedColumns: string[] = ['id', 'report_date', 'weekDayName',
    'total_distance','total_travelled_time','max_speed', 'avg_speed','free_wheeling_distance'];
  dataSource = new MatTableDataSource<Detail>(this.ELEMENT_DATA);

  private vehicles: HomeLiteV1Data[] = [];
  private finalSum: Detail;
  private selectedRow: HomeLiteV1Data;

  public startDate = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
  public endDate = new Date();
  public currentDate = new Date();

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  TableDataNotshow: boolean;

  constructor(private headerService: HeaderInteractorService,
    private location: Location,
    private uTrackService: UtrackService,
    private routes: Router,
    private activatedRoute: ActivatedRoute,
    private toasterService: NbToastrService,
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.dashboard_device_link_id = params.device_link_id;
    });
  }
  private dashboard_device_link_id: string;

  daywiseSearchForm = new FormGroup({
    vechicleName: new FormControl(''),
    startDate: new FormControl(this.startDate),
    endDate: new FormControl(this.endDate),
  });

  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.getVehicles();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Daywise Kilometer Report');
    this.dataSource.sort = this.sort;
    this.searchvehiclenumber.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterVehicles();
    });
  }

  back() {
    this.location.back();
  }

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
    // filter the
    this.filteredVehicleNumber.next(
      this.vehicles.filter(searchData => searchData.vehicle_number.toLowerCase().indexOf(search) > -1),
    );
  }

  getVehicles() {
    this.uTrackService.home_lite_v1().subscribe(response => {
      if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
        this.vehicles = response.data;
        this.filteredVehicleNumber.next(this.vehicles);
        this.TableDataNotshow = false;
        if (this.dashboard_device_link_id == undefined || this.dashboard_device_link_id == null || this.dashboard_device_link_id == "") {
          this.selectedRow = this.vehicles[0];
          this.deviceLinkId = this.selectedRow.device_link_id
          } else {
            this.vehicles.forEach(element => {
              if (this.dashboard_device_link_id == element.device_link_id) {
                this.deviceLinkId = this.dashboard_device_link_id;
              }
            })
          }
        this.fetchDataFromApi();
      } else {
        this.TableDataNotshow = true;
      }
    });
  }

  refresh() {
    this.fetchDataFromApi();
  }

  updateSelectedValue(row) {
    this.deviceLinkId = row.device_link_id;
    this.viewReport();
  }

  downloadPDF() {
    const title1 = 'UTrack Daywise KM Report\n';
    const title2 = this.selectedRow.vehicle_number + '(' + this.selectedRow.vehicle_type + ')' + '\n';
    const title3 = DateUtils.getDisplayDate(this.daywiseSearchForm.value.startDate) + ' To '
      + DateUtils.getDisplayDate(this.daywiseSearchForm.value.endDate);
    const pdf_heading_date = title1.concat(title2).concat(title3);
    const columns: string[] = ['ID', 'Report Date', 'Day', 'Total Distance (KM)','Total Travel Time (HH:MM:SS)', 'Max Speed (KMPH)', 'Avg Speed (KMPH)','Free Wheeling (KM)'];
    const data: String[][] = [];
    let i = 1;
    for (const mydata of this.ELEMENT_DATA) {
      const row: String[] = [];
      row.push(i.toString());
      row.push(mydata.report_date);
      row.push(mydata.report_day);
      row.push(mydata.total_distance);
      row.push(mydata.total_travelled_time);
      row.push(mydata.max_speed);
      row.push(mydata.avg_speed);
      row.push(mydata.free_wheeling_distance);
      data.push(row);
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_date, columns, data, 'DaywiseKMReport');
  }

  epxportexcle() {
    const columns = ['ID', 'Report Date', 'Day','Total Distance (KM)','Total Travel Time (HH:MM:SS)','Max Speed (KMPH)', 'Avg Speed (KMPH)','Free Wheeling (KM)'];
    const title_dates = DateUtils.getDisplayDate(this.daywiseSearchForm.value.startDate) + ' TO '
      + DateUtils.getDisplayDate(this.daywiseSearchForm.value.endDate);
    const mainTitle = 'UTrack Daywise KM Report' + ' - ' + this.selectedRow.vehicle_number + ' ( ' + this.selectedRow.vehicle_type + ' )';

    // Create a workbook with a worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Utrack');
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
    // Add Row and formatting
    worksheet.mergeCells('C1', 'F2');
    const titleRow = worksheet.getCell('C1');
    titleRow.value = mainTitle;
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
    startToendData.value = title_dates;
    startToendData.font = {
      name: 'Calibri',
      size: 14,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' },
    };
    startToendData.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow([]);
    // Adding Header Row
    const headerRow = worksheet.addRow(columns);
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
    const data: String[][] = [];
    let i = 1;
    for (const mydata of this.ELEMENT_DATA) {
      const row: String[] = [];
      row.push(i.toString());
      row.push(mydata.report_date);
      row.push(mydata.report_day);
      row.push(mydata.total_distance);
      row.push(mydata.total_travelled_time);
      row.push(mydata.max_speed);
      row.push(mydata.avg_speed);
      row.push(mydata.free_wheeling_distance);
      data.push(row);
      worksheet.addRow(row);
      i++;
    }
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 16;
    worksheet.getColumn(4).width = 34;
    worksheet.getColumn(5).width = 25;
    worksheet.getColumn(6).width = 23;
    worksheet.getColumn(7).width = 23;
    worksheet.getColumn(8).width = 23;
    worksheet.addRow([]);
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'DaywiseKMReport' + '.xlsx');
    });
  }

  fetchDataFromApi() {
    this.uTrackService.getdaywisekmDetails(this.deviceLinkId,
      DateUtils.getServerDate(this.daywiseSearchForm.value.startDate),
      DateUtils.getServerDate(this.daywiseSearchForm.value.endDate))
      .subscribe(response => {
        this.ELEMENT_DATA = [];
        if (response.status && response.data.detail != null && response.data.detail != undefined && response.data.detail.length > 0) {
          this.TableDataNotshow = false;
          this.ELEMENT_DATA = response.data.detail;
          this.finalSum = {} as Detail;
          this.finalSum.report_date = 'Sum';
          this.finalSum.report_day = '-';
          this.finalSum.total_distance = response.data.total_distance;
          this.finalSum.total_travelled_time = response.data.total_travelled_time;
          this.finalSum.max_speed = response.data.max_speed;
          this.finalSum.avg_speed = response.data.avg_speed;
          this.finalSum.free_wheeling_distance = response.data.free_wheeling_distance;
          this.ELEMENT_DATA.push(this.finalSum);
        } else {
          this.TableDataNotshow = true;
        }
        this.dataSource.data = this.ELEMENT_DATA;
      });
  }

  viewReport() {
    const start_date = DateUtils.getServerDateTime(this.daywiseSearchForm.value.startDate);
    const end_date = DateUtils.getServerDateTime(this.daywiseSearchForm.value.endDate);
    const start_milli_sec = DateUtils.getDateDifference(this.daywiseSearchForm.value.startDate);
    const end_milli_sec = DateUtils.getDateDifference(this.daywiseSearchForm.value.endDate);

    if (start_date > end_date) {
      this.toasterService.danger('', 'Start date should be less than End date.');
    } else if ((end_milli_sec - start_milli_sec) > 5356800000) {
      this.toasterService.danger('', 'Difference between start and end date should be less than 62 days.');
    } else {
      this.fetchDataFromApi();
    }
  }

  trackHistory(report_date) {
    this.routes.navigate([`web/track_history`, this.selectedRow.device_link_id, DateUtils.getServerDate(report_date)])
    { this.activatedRoute; }
  }
}
