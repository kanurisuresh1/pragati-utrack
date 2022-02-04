import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { FormGroup, FormControl } from '@angular/forms';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { TrackReport } from '../../../@theme/components/Model/TrackHistoryResponse';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { NbThemeService, NbToastrService } from '@nebular/theme';
import { ActivatedRoute, Router } from '@angular/router';
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
import { Detail } from '../../../@theme/components/Model/SingleDeviceReportStatusReportV1Response';

@Component({
  selector: 'ngx-track-history',
  templateUrl: './track-history.component.html',
  styleUrls: ['./track-history.component.scss']
})
export class TrackHistoryComponent implements OnInit {

  data: TrackReport[];
  selectedChart = "0";
  selectedKmReport = "0"

  KilometerReportTableDataShow: boolean;
  KilometerReportTableDataNotshow: boolean;
  GraphDataNotshow: boolean;

  startDate = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
  endDate = new Date();
  currentDate = new Date();
  minStartDate = new Date(new Date().getTime() - (365 * 24 * 60 * 60 * 1000));
  changedStartDate = new Date()

  vehicles: HomeLiteV1Data[] = [];
  deviceLinkId: string;

  dashboard_device_link_id: string
  customeTotalDistance: string;
  customeTotalTravelledTime: string;
  customeMaxSpeed: string;
  customeAvgSpeed: string;
  customedate: string;
  vehicle_number: string;
  vehicle_type: string;
  selectedRow: HomeLiteV1Data;
  device_link_id: string;

  summaryReportBarChartoptions: any = {};
  summaryReportBarChart: any;

  constructor(
    private location: Location,
    private headerService: HeaderInteractorService,
    private uTrackService: UtrackService,
    private theme: NbThemeService,
    private routes: Router,
    private activatedRoute: ActivatedRoute,
    private toasterService: NbToastrService,
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.dashboard_device_link_id = params.device_link_id
    })

  }

  //Kilometer Report Data

  TodayELEMENT_DATA: Detail[] = [];

  todatDisplayedColumn: string[] = [
    'device_id', 'report_date', 'weekDayName', 'total_distance', 'total_travelled_time', 'max_speed', 'avg_speed'];
  todaydataSource = new MatTableDataSource<Detail>(this.TodayELEMENT_DATA);

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Summary Report');
    this.getVehicles();
    this.searchvehiclenumber.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterVehicles();
    });
  }

  trackHistoryReportForm = new FormGroup({
    vechicleName: new FormControl(''),
    startDate: new FormControl(this.startDate),
    endDate: new FormControl(this.endDate)
  })


  barChart(KilometerArray, reportDateArray) {
    this.summaryReportBarChart = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;
      this.summaryReportBarChartoptions = {
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

  public searchvehiclenumber: FormControl = new FormControl();
  public filteredVehicleNumber: ReplaySubject<HomeLiteV1Data[]> = new ReplaySubject<HomeLiteV1Data[]>(1);

  @ViewChild('singleSelect', { static: false }) singleSelect: MatSelect;
  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

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
        this.KilometerReportTableDataShow = true;
        this.KilometerReportTableDataNotshow = false;
        this.GraphDataNotshow = false;
        this.vehicles = response.data
        this.selectedRow = this.vehicles[0];
        this.filteredVehicleNumber.next(this.vehicles);
        if (this.dashboard_device_link_id == undefined || this.dashboard_device_link_id == null || this.dashboard_device_link_id == "") {
          this.deviceLinkId = this.selectedRow.device_link_id;
          this.device_link_id = this.selectedRow.device_link_id;
          this.vehicle_number = this.selectedRow.vehicle_number;
          this.vehicle_type = this.selectedRow.vehicle_type;
        } else {
          this.vehicles.forEach(element => {
            if (this.dashboard_device_link_id == element.device_link_id) {
              this.deviceLinkId = this.dashboard_device_link_id
              this.device_link_id = this.dashboard_device_link_id
            }
          })
        }
        this.final_summary_report_mongo();
        this.single_device_report_stats_v1();
        this.single_device_report_stats_start_date();
      } else {
        this.KilometerReportTableDataShow = false;
        this.KilometerReportTableDataNotshow = true;
        this.GraphDataNotshow = true;
      }
    })
  }

  updateSelectedValue(row) {
    this.selectedRow = row;
    this.device_link_id = this.selectedRow.device_link_id;
    this.vehicle_number = this.selectedRow.vehicle_number;
    this.vehicle_type = this.selectedRow.vehicle_type;
    this.viewReport();
  }

  final_summary_report_mongo() {
    var time_diff = 120
    this.uTrackService.final_summary_report_mongo_v2(this.deviceLinkId,
      DateUtils.getServerDateTime(this.trackHistoryReportForm.value.startDate),
      DateUtils.getServerDateTime(this.trackHistoryReportForm.value.endDate), time_diff, '0','1').subscribe(response => {
        this.data = [];
        if (response.status && response.data != null && response.data != undefined && response.data != null) {
          this.customedate = DateUtils.getDisplayDateTimeFromDateInMins(this.trackHistoryReportForm.value.startDate) + ' To ' + DateUtils.getDisplayDateTimeFromDateInMins(this.trackHistoryReportForm.value.endDate)
          let customeDisplayData = response.data.device_report_stats_custom;
          this.customeTotalDistance = customeDisplayData.total_distance;
          this.customeTotalTravelledTime = customeDisplayData.total_travelled_time;
          this.customeMaxSpeed = customeDisplayData.max_speed;
          this.customeAvgSpeed =customeDisplayData.avg_speed;
        }
      })
  }


  downloadTodayKMPdf() {
    var converted_startdate = DateUtils.getDisplayDateTimeFromDate(this.trackHistoryReportForm.value.startDate);
    var converted_enddate = DateUtils.getDisplayDateTimeFromDate(this.trackHistoryReportForm.value.endDate);
    var myText = 'UTrack Kilometer Report \n '
    var vehiclenum = this.vehicle_number;
    var vehicletype = this.vehicle_type;
    var pdf_heading_date = myText.concat(vehiclenum, '(', vehicletype, ')', '\n ', converted_startdate, ' To ', converted_enddate)
    let columns: string[] = ['ID', 'Report Date', 'Week Day', 'Distance (KM)', ' Travel Time (HH:MM:SS)', 'Max Speed (KMPH) ', 'Avg Speed (KMPH)'];
    let data: String[][] = [];

    let i = 1;
    for (let value of this.TodayELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.rd);
      row.push(value.day);
      row.push(value.td);
      row.push(value.ttt);
      row.push(value.ms);
      row.push(value.as);
      data.push(row)
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_date, columns, data, 'KMSummaryReport');
  }

  exportexcleTodayKM() {
    let columns = ['ID', 'Report Date', 'Week Day', 'Distance (KM)', ' Travel Time (HH:MM:SS)', 'Max Speed (KMPH) ', 'Avg Speed(KMPH)', ''];
    const converted_startdate = DateUtils.getDisplayDateTimeFromDate(this.trackHistoryReportForm.value.startDate);
    const converted_enddate = DateUtils.getDisplayDateTimeFromDate(this.trackHistoryReportForm.value.endDate);
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

    worksheet.mergeCells('H1:H3');
    worksheet.addImage(ramkiLogo, 'H1:H3');
    //Add Row and formatting
    worksheet.mergeCells('C1', 'G2');

    let titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack Kilometer Report' + ' - ' + this.vehicle_number + ' ( ' + this.vehicle_type + ' )'
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
    startToendData.value = converted_startdate + ' TO ' + converted_enddate
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
    for (let value of this.TodayELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.rd);
      row.push(value.day);
      row.push(value.td);
      row.push(value.ttt);
      row.push(value.ms);
      row.push(value.as);
      worksheet.addRow(row)
      i++;
    }
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 18;
    worksheet.getColumn(5).width = 29;
    worksheet.getColumn(6).width = 22;
    worksheet.getColumn(7).width = 22;
    worksheet.getColumn(8).width = 27;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'KMSummaryReport' + '.xlsx');
    })
  }

  todayTotalDistance: string;
  todayTotalTravelledTime: string;
  todayMaxSpeed: string;
  todayAvgSpeed: string;
  today_report_date: string;

  startTotalDistance: string;
  startTotalTravelledTime: string;
  startMaxSpeed: string;
  startAvgSpeed: string;
  start_report_date: string;

  weekTotalDistance: string;
  weekTotalTravelledTime: string;
  weekMaxSpeed: string;
  weekAvgSpeed: string;
  week_report_date: string;

  last7DaysTotalDistance: string;
  last7DaysTotalTravelledTime: string;
  last7DaysMaxSpeed: string;
  last7DaysAvgSpeed: string;
  last7Days_report_date: string;

  monthTotalDistance: string;
  monthTotalTravelledTime: string;
  monthMaxSpeed: string;
  monthAvgSpeed: string;
  month_report_date: string;
  // on Map card Data
  map_total_distance: string;
  map_avg_speed: string;
  map_max_speed: string;

  single_device_report_stats_v1() {
    this.uTrackService.single_device_report_stats_v1(this.deviceLinkId,
      DateUtils.getServerDateFromDate(this.currentDate)).subscribe(response => {

        this.thisMonthData = [];
        this.thisWeekData = [];
        this.last7DaysData = [];
        this.KilometerArrayThisMonth = [];
        this.reportDateArrayThisMonth = [];
        this.KilometerArrayThisWeek = [];
        this.reportDateArrayThisWeek = [];
        this.KilometerArrayThisLast7Days = [];
        this.reportDateArrayLast7DAys = [];

        const bar_colors_this_week = [
          '#fa163f', '#32dbc6', '#00bfff',
          '#0040ff', '#8000ff', '#ff00bf',
          '#ff0040', '#1089ff', '#00CC00', '#303960'];

        const bar_colors_last7Days = [
          '#00bfff', '#0040ff', '#8000ff',
          '#ff00bf', '#ff0040', '#1089ff',
          '#00CC00', '#080aff', '#fa163f', '#303960'];

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
          var val = response.data[0];

          if (val.today != null && val.today != undefined) {
            var today = val.today;
            this.today_report_date = today.rd;
            this.todayTotalDistance = today.td;
            this.todayTotalTravelledTime = today.ttt;
            this.todayMaxSpeed = today.ms;
            this.todayAvgSpeed = today.as;
          } else {
            this.today_report_date = '-';
            this.todayTotalDistance = '-';
            this.todayTotalTravelledTime = '-';
            this.todayMaxSpeed = '-';
            this.todayAvgSpeed = '-';
          }

          if (val.this_week != null && val.this_week != undefined) {
            var this_week = val.this_week;
            this.week_report_date = this_week.detail[0].rd + ' To ' + this_week.detail[this_week.detail.length - 1].rd
            this.weekTotalDistance = this_week.td;
            this.weekTotalTravelledTime = this_week.ttt;
            this.weekMaxSpeed = this_week.ms;
            this.weekAvgSpeed = this_week.as;
            if (this_week.detail != null && this_week.detail != undefined && this_week.detail.length > 0) {
              let i = 1;
              this_week.detail.forEach((data => {
                this.reportDateArrayThisWeek.push(data.rd)
                const this_week_val = {
                  value: data.td,
                  itemStyle: {
                    color: bar_colors_this_week[i % 10],
                  }
                }
                this.KilometerArrayThisWeek.push(this_week_val);
                i++;
              }))
              this.thisWeekData = this_week.detail;
            }
          } else {
            this.week_report_date = '-';
            this.weekTotalDistance = '-';
            this.weekTotalTravelledTime = '-';
            this.weekMaxSpeed = '-';
            this.weekAvgSpeed = '-';
          }

          if (val.last_7 != null && val.last_7 != undefined) {
            var last_7 = val.last_7;
            this.last7Days_report_date = DateUtils.getDisplayDateFromDate(new Date(new Date().getTime() - (6 * 24 * 60 * 60 * 1000))) + ' To ' + DateUtils.getDisplayDateFromDate(new Date());
            this.last7DaysTotalDistance = last_7.td;
            this.last7DaysTotalTravelledTime = last_7.ttt;
            this.last7DaysMaxSpeed = last_7.ms;
            this.last7DaysAvgSpeed = last_7.as;
            if (last_7.detail != null && last_7.detail != undefined && last_7.detail.length > 0) {
              let i = 1;
              last_7.detail.forEach((data => {
                this.reportDateArrayLast7DAys.push(data.rd)
                const last_7days = {
                  value: data.td,
                  itemStyle: {
                    color: bar_colors_last7Days[i % 10],
                  }
                }
                this.KilometerArrayThisLast7Days.push(last_7days);
                i++;
              }))
              this.last7DaysData = last_7.detail;
            }
          } else {
            this.last7Days_report_date = '-';
            this.last7DaysTotalDistance = '-';
            this.last7DaysTotalTravelledTime = '-';
            this.last7DaysMaxSpeed = '-';
            this.last7DaysAvgSpeed = '-';
          }

          if (val.this_month != null && val.this_month != undefined) {
            var this_month = val.this_month;
            this.month_report_date = DateUtils.getDisplayMonth(this_month.detail[0].rd)
            this.monthTotalDistance = this_month.td;
            this.monthTotalTravelledTime = this_month.ttt;
            this.monthMaxSpeed = this_month.ms;
            this.monthAvgSpeed = this_month.as;
            if (this_month.detail != null && this_month.detail != undefined && this_month.detail.length > 0) {
              let i = 1;
              this_month.detail.forEach((data => {
                this.reportDateArrayThisMonth.push(data.rd)
                const this_month_val = {
                  value: data.td,
                  itemStyle: {
                    color: bar_colors_this_month[i % 10],
                  }
                }
                this.KilometerArrayThisMonth.push(this_month_val);
                i++;
              }))
              this.thisMonthData = this_month.detail;
            }
          } else {
            this.month_report_date = '-';
            this.monthTotalDistance = '-';
            this.monthTotalTravelledTime = '-';
            this.monthMaxSpeed = '-';
            this.monthAvgSpeed = '-';
          }
          this.updateTableData(this.thisMonthData)
          this.barChart(this.KilometerArrayThisMonth, this.reportDateArrayThisMonth)
        }
      })
  }

  updateTableData(data) {
    this.TodayELEMENT_DATA = data;
    this.todaydataSource.data = this.TodayELEMENT_DATA;
    if (this.TodayELEMENT_DATA.length > 0) {
      this.KilometerReportTableDataShow = true;
      this.KilometerReportTableDataNotshow = false;
    } else {
      this.KilometerReportTableDataShow = false;
      this.KilometerReportTableDataNotshow = true;
    }
  }

  single_device_report_stats_start_date() {
    this.uTrackService.single_device_report_stats_v1(this.deviceLinkId,
      DateUtils.getServerDateFromDate(this.trackHistoryReportForm.value.startDate)).subscribe(response => {
        if (response.status && response.data != null && response.data != undefined
          && response.data.length > 0 && response.data[0].today != null && response.data[0].today != undefined) {
          var val = response.data[0].today;
          this.start_report_date = val.rd;
          this.startTotalDistance = val.td;
          this.startTotalTravelledTime = val.ttt
          this.startMaxSpeed = val.ms;
          this.startAvgSpeed = val.as;
        } else {
          this.start_report_date = '-';
          this.startTotalDistance = '-';
          this.startTotalTravelledTime = '-';
          this.startMaxSpeed = '-';
          this.startAvgSpeed = '-';
        }
      })
  }

  thisMonthData: Detail[] = [];
  thisWeekData: Detail[] = [];
  last7DaysData: Detail[] = [];
  KilometerArrayThisMonth = [];
  reportDateArrayThisMonth = [];
  KilometerArrayThisWeek = [];
  reportDateArrayThisWeek = [];
  KilometerArrayThisLast7Days = [];
  reportDateArrayLast7DAys = [];

  changeKMThisWeekThisMonthDropdown(val) {
    switch (val) {
      case "0": this.updateTableData(this.thisMonthData);
        break;
      case "1": this.updateTableData(this.thisWeekData);
        break;
      case "2": this.updateTableData(this.last7DaysData);
        break;
    }
  }

  changeReportThisWeekThisMonthDropdown(val) {
    switch (val) {
      case "0": this.barChart(this.KilometerArrayThisMonth, this.reportDateArrayThisMonth)
        break;
      case "1": this.barChart(this.KilometerArrayThisWeek, this.reportDateArrayThisWeek)
        break;
      case "2": this.barChart(this.KilometerArrayThisLast7Days, this.reportDateArrayLast7DAys)
        break;
    }
  }

  back() {
    this.location.back()
  }

  viewReport() {
    const start_date = DateUtils.getServerDateTime(this.trackHistoryReportForm.value.startDate);
    const end_date = DateUtils.getServerDateTime(this.trackHistoryReportForm.value.endDate);
    const start_milli_sec = DateUtils.getDateDifference(this.trackHistoryReportForm.value.startDate);
    const end_milli_sec = DateUtils.getDateDifference(this.trackHistoryReportForm.value.endDate);

    if (start_date > end_date) {
      this.toasterService.danger('', 'Start date should be less than End date.');
    } else if ((end_milli_sec - start_milli_sec) > 3888000000) {
      this.toasterService.danger('', 'Difference between start and end date should be less than 45 days.');
    } else {
      this.final_summary_report_mongo();
      this.single_device_report_stats_start_date();
    }
  }

  vehicleChange() {
    this.final_summary_report_mongo();
    this.single_device_report_stats_v1();
    this.single_device_report_stats_start_date();
  }

  trackHistory(report_date_formatted) {
    this.routes.navigate([`web/track_history`, this.device_link_id, report_date_formatted])
    { relativeTo: this.activatedRoute }
  }

}
