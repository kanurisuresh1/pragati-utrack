import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import 'jspdf-autotable';
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
import { NbThemeService, NbToastrService } from '@nebular/theme';
import { distanceReportResponseData } from '../../../@theme/components/Model/DistanceReportResponse';

@Component({
  selector: 'ngx-distance-report',
  templateUrl: './distance-report.component.html',
  styleUrls: ['./distance-report.component.scss']
})
export class DistanceReportComponent implements OnInit {

  private vehicles: HomeLiteV1Data[] = [];
  deviceLinkId: string;
  selectTimeInterval: number;

  startDate = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
  endDate = new Date();
  currentDate = new Date();
  minStartDate = new Date(new Date().getTime() - (365 * 24 * 60 * 60 * 1000));

  mainData: distanceReportResponseData[] = [];
  distanceDisplayedColumns: string[] = ['id', 'from_date_time', 'to_date_time', 'distance', 'cumulative_distance'];
  distanceReportdataSource = new MatTableDataSource<distanceReportResponseData>(this.mainData);

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dashboard_device_link_id: string = '';
  selectedRow: HomeLiteV1Data;
  vehicle_number: string;
  vehicle_type: string;
  DistanceReportTableDataNotshow: boolean;

  distanceReportBarChart: any;
  barChartOptions: any = {};

  constructor(
    private location: Location,
    private headerService: HeaderInteractorService,
    private uTrackService: UtrackService,
    private activatedRoute: ActivatedRoute,
    private toasterService: NbToastrService,
    private theme: NbThemeService,
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
    this.headerService.updateHeaderTitle('HEADER_NAMES.Distance Report');
    this.getVehicles();
    this.selectTimeInterval = 60;
    this.searchvehiclenumber.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterVehicles();
    });
  }

  distanceReportForm = new FormGroup({
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
      this.vehicles = [];
      if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
        this.vehicles = response.data
        this.filteredVehicleNumber.next(this.vehicles);
        this.DistanceReportTableDataNotshow = false;
        if (this.dashboard_device_link_id == undefined || this.dashboard_device_link_id == null || this.dashboard_device_link_id == "") {
          this.deviceLinkId = this.vehicles[0].device_link_id;
          this.vehicle_number = this.vehicles[0].vehicle_number;
          this.vehicle_type = this.vehicles[0].vehicle_type;
        } else {
          this.vehicles.forEach(element => {
            if (this.dashboard_device_link_id == element.device_link_id) {
              this.deviceLinkId = this.dashboard_device_link_id
            }
          })
        }
        this.new_track_report_web_mongo();
      } else {
        this.DistanceReportTableDataNotshow = true;
      }
    })
  }

  new_track_report_web_mongo() {
    this.uTrackService.distance_report(this.deviceLinkId,
      DateUtils.getServerDateTimeFromDate(this.distanceReportForm.value.startDate),
      DateUtils.getServerDateTimeFromDate(this.distanceReportForm.value.endDate),
      this.distanceReportForm.value.vehicleTimeInterval).subscribe(response => {
        this.mainData = [];
        this.KilometerArrayThisMonth = [];
        this.reportDateArrayThisMonth = [];
        const bar_colors_this_month = [
          '#9242cf', '#00CC00', '#080aff',
          '#fa163f', '#32dbc6', '#00bfff',
          '#0040ff', '#8000ff', '#ff00bf',
          '#ff0040', '#1089ff', '#00CC00',
          '#080aff', '#fa163f', '#32dbc6',
          '#00bfff', '#0040ff', '#8000ff',
          '#ff00bf', '#ff0040', '#1089ff',
          '#00CC00', '#080aff', '#fa163f',
          '#32dbc6', '#00bfff', '#0040ff',
          '#8000ff', '#ff00bf', '#ff0040', '#8000ff'
        ]

        if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
          this.DistanceReportTableDataNotshow = false;
          this.mainData = response.data;
          let i = 1;
          response.data.forEach((data => {
            this.reportDateArrayThisMonth.push(data.fdt)
            const this_month_val = {
              value: data.d,
              itemStyle: {
                color: bar_colors_this_month[i % 10],
              }
            }
            this.KilometerArrayThisMonth.push(this_month_val);
            i++;
          }))
          this.barChart(this.KilometerArrayThisMonth, this.reportDateArrayThisMonth);
        } else {
          this.DistanceReportTableDataNotshow = true;
        }
        this.distanceReportdataSource.data = this.mainData;
      })
  }

  KilometerArrayThisMonth = [];
  reportDateArrayThisMonth = [];

  barChart(KilometerArray, reportDateArray) {
    this.distanceReportBarChart = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.barChartOptions = {
        backgroundColor: echarts.bg,
        color: ['#0f4c75'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: reportDateArray,
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
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
            name: 'KM',
            type: 'bar',
            barWidth: '45%',
            data: KilometerArray,
          },
        ],
      };
    });
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

  downloadPDF() {
    const title1 = 'UTrack Distance Data \n ';
    const title2 = this.vehicle_number + '(' + this.vehicle_type + ')' + '\n';
    const title3 = DateUtils.getDisplayDateTime(this.distanceReportForm.value.startDate) + ' To '
      + DateUtils.getDisplayDateTime(this.distanceReportForm.value.endDate);
    const pdf_heading_date = title1.concat(title2).concat(title3);

    let columns: string[] = ['ID', 'From Date Time', 'To Date Time', 'Distance (KM)', 'Cumulative Distance (KM)'];
    let data: String[][] = [];
    let i = 1;
    for (let mydata of this.mainData) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(mydata.fdt);
      row.push(mydata.tdt);
      row.push(mydata.d);
      row.push(mydata.cd);
      data.push(row);
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_date, columns, data, 'DistanceReport');
  }


  epxportexcle() {
    let DistanceReportcolumns = ['ID', 'From Date Time', 'To Date Time', 'Distance (KM)', 'Cumulative Distance (KM)', ' '];
    const converted_date = DateUtils.getDisplayDateTime(this.distanceReportForm.value.startDate) + ' To '
      + DateUtils.getDisplayDateTime(this.distanceReportForm.value.endDate);

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
    titleRow.value = 'UTrack Distance Report' + ' - ' + this.vehicle_number + ' ( ' + this.vehicle_type + ' )'
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
      row.push(mydata.d);
      row.push(mydata.cd);
      worksheet.addRow(row);
      i++;
    }
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 22;
    worksheet.getColumn(3).width = 35;
    worksheet.getColumn(4).width = 28;
    worksheet.getColumn(5).width = 28;
    worksheet.getColumn(6).width = 30;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'DistanceReport' + '.xlsx');
    })
  }


  viewReport() {
    const start_date = DateUtils.getServerDateTime(this.distanceReportForm.value.startDate);
    const end_date = DateUtils.getServerDateTime(this.distanceReportForm.value.endDate);
    const start_mili_sec = DateUtils.getDateDifference(this.distanceReportForm.value.startDate);
    const end_mili_sec = DateUtils.getDateDifference(this.distanceReportForm.value.endDate);

    if (start_date > end_date) {
      this.toasterService.danger('', 'Start date should be less than End date.');
    } else if ((end_mili_sec - start_mili_sec) > 3888000000) {
      this.toasterService.danger('', 'Difference between start and end date should be less than 45 days.');
    } else {
      this.new_track_report_web_mongo();
    }
  }
}
