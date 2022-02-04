import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
//excel import paclage
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { ActivatedRoute, Router } from '@angular/router';
import { AllDeviceReport } from '../../../@theme/components/Model/NewAllDeviceV1ReportStatsResponse';

export const MY_FORMATS = {
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};

@Component({
  selector: 'ngx-daily-summary-km-report',
  templateUrl: './daily-summary-km-report.component.html',
  styleUrls: ['./daily-summary-km-report.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],

})
export class DailySummaryKmReportComponent implements OnInit {

  public todayDate: Date = new Date();
  TableDataNotshow: boolean;

  ELEMENT_DATA: AllDeviceReport[] = [];
  displayedColumns: string[] = ['id', 'vehicle_number', 'total_distance', 'total_travelled_time', 'max_speed', 'avg_speed','free_wheeling_distance'];
  dataSource = new MatTableDataSource<AllDeviceReport>(this.ELEMENT_DATA);

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private location: Location,
    private uTrackService: UtrackService,
    private headderService: HeaderInteractorService,
    private routes: Router,
    private activatedRoute: ActivatedRoute
  ) {

  }

  dailySummarKMReportForm = new FormGroup({
    startDate: new FormControl(this.todayDate),
  });

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage()
    this.headderService.updateHeaderTitle('HEADER_NAMES.Daily Summary KM Report All Vehicles');
    this.dataSource.sort = this.sort;
    this.getDailySummaryKMReport();
  }

  back() {
    this.location.back();
  }

  viewReport() {
    this.getDailySummaryKMReport();
  }

  getDailySummaryKMReport() {
    this.uTrackService.new_all_device_report_stats_v1(
      DateUtils.getServerDate(this.dailySummarKMReportForm.value.startDate))
      .subscribe(response => {
        this.ELEMENT_DATA = []
        if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
          this.TableDataNotshow = false;
          this.ELEMENT_DATA = response.data;
        } else {
          this.TableDataNotshow = true;
        }
        this.dataSource.data = this.ELEMENT_DATA;
      });
  }

  private filterValue = '';

  applyFilter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.filterValue = (event.target as HTMLInputElement).value;
      this.filterValue = this.filterValue.trim(); // Remove whitespace
      this.dataSource.filter = this.filterValue;
      this.dataSource.data = this.ELEMENT_DATA;
    }
  }

  search() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_element') as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue;
    this.dataSource.data = this.ELEMENT_DATA;
  }

  refresh() {
    this.getDailySummaryKMReport();
  }

  downloadPDF() {
    const title1 = 'UTrack  Daily Summary KM Report All Vehicles  \n';
    const title2 = 'Report Date  ' + DateUtils.getDisplayDate(this.dailySummarKMReportForm.value.startDate);
    const pdf_heading_date = title1.concat(title2);
    const dailySummaryColumns: string[] = ['ID', 'Vehicle Number', 'Total Distance (KM)', 'Total Travelled Time (HH:MM:SS)', 'Max Speed (KMPH)', 'Avg Speed (KMPH)','Free Wheeling (KM)'];
    const data: String[][] = [];
    let i = 1;
    this.ELEMENT_DATA.forEach(function (value) {
      const row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.today.total_distance);
      row.push(value.today.total_travelled_time);
      row.push(value.today.max_speed);
      row.push(value.today.avg_speed);
      row.push(value.today.free_wheeling_distance);
      data.push(row);
      i++;
    }),
      PdfUtils.downloadPdf(pdf_heading_date, dailySummaryColumns, data, 'Daily_Summary_KM_Report');
  }

  epxportexcle() {
    const columns = ['ID', 'Vehicle Number', 'Total Distance (KM)', 'Total Travelled Time (HH:MM:SS)', 'Max Speed (KMPH)', 'Avg Speed (KMPH)', 'Free Wheeling (KM)'];
    const converted_startdate = DateUtils.getDisplayDate(this.dailySummarKMReportForm.value.startDate);
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
    worksheet.mergeCells('G1:G3');
    worksheet.addImage(ramkiLogo, 'G1:;G3');

    worksheet.mergeCells('C1', 'F2');
    const titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack  Daily Summary KM Report All Vehicles';
    titleRow.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' },
    },
      titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('C3', 'F3');
    const startToendData = worksheet.getCell('C3');
    startToendData.value = 'Report Date' + ' ' + converted_startdate;
    startToendData.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' },
    },
      startToendData.alignment = { vertical: 'middle', horizontal: 'center' },
      worksheet.addRow([]);
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
        top: { style: 'thin' }, left: { style: 'thin' }
        , bottom: { style: 'thin' }, right: { style: 'thin' },
      };
    });
    let i = 1;
    this.ELEMENT_DATA.forEach(function (value) {
      const row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.today.total_distance);
      row.push(value.today.total_travelled_time);
      row.push(value.today.max_speed);
      row.push(value.today.avg_speed);
      row.push(value.today.free_wheeling_distance);
      worksheet.addRow(row);
      i++;
    }),
      worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 21;
    worksheet.getColumn(3).width = 23;
    worksheet.getColumn(4).width = 38;
    worksheet.getColumn(5).width = 23;
    worksheet.getColumn(6).width = 22;
    worksheet.getColumn(7).width = 27;
    worksheet.getColumn(8).width = 27;
    worksheet.addRow([]);
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Daily_Summary_KM_Report' + '.xlsx');
    });
  }

  trackHistory(device_link_id) {
    this.routes.navigate([`web/track_history`, device_link_id]);
    { this.activatedRoute; }
  }
}
